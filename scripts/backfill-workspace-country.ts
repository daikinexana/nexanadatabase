/**
 * 既存ワークスペースの country / city を住所から再計算して埋め直すバックフィル。
 *
 * 目的: 以前は海外住所が country="その他" に潰れていたため、/workspace のエリア
 *       絞り込みに国名が出なかった。住所から国（可能なら都市）を判定して更新する。
 *
 * 使い方（プロジェクトルートで実行）:
 *   ドライラン（変更しない・確認のみ）:
 *     node --env-file=.env node_modules/.bin/tsx scripts/backfill-workspace-country.ts
 *   実際に更新する:
 *     node --env-file=.env node_modules/.bin/tsx scripts/backfill-workspace-country.ts --apply
 *
 * ※ DATABASE_URL は .env から読み込みます（本番DBに接続します）。
 */

import { PrismaClient } from "@prisma/client";
import { deriveCountryCity } from "@/lib/derive-location";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL が未設定です。`node --env-file=.env ...` で実行してください。");
  }

  // country が未設定/その他/海外 のもの、または city が空/その他 のものを対象に再計算
  const targets = await prisma.workspace.findMany({
    where: {
      OR: [
        { country: { in: ["その他", "海外", ""] } },
        { city: { in: ["その他", ""] } },
      ],
    },
    select: { id: true, name: true, address: true, country: true, city: true },
  });

  console.log(`対象候補: ${targets.length}件（country/city が「その他」等）`);

  let willUpdate = 0;
  const updates: { id: string; from: string; to: string; name: string }[] = [];

  for (const w of targets) {
    const derived = deriveCountryCity(w.address ?? "", "");
    // 住所から国が判定できない場合は変更しない
    if (derived.country === "その他") continue;
    if (derived.country === w.country && derived.city === w.city) continue;
    willUpdate++;
    updates.push({
      id: w.id,
      name: w.name,
      from: `${w.country} / ${w.city}`,
      to: `${derived.country} / ${derived.city}`,
    });
  }

  console.log(`更新対象: ${willUpdate}件`);
  for (const u of updates) {
    console.log(`  - ${u.name}: [${u.from}] -> [${u.to}]`);
  }

  if (!APPLY) {
    console.log("\nドライランです。実際に更新するには --apply を付けて再実行してください。");
    return;
  }

  for (const u of updates) {
    const [country, city] = u.to.split(" / ");
    await prisma.workspace.update({ where: { id: u.id }, data: { country, city } });
  }
  console.log(`\n✅ ${willUpdate}件を更新しました。`);
}

main()
  .catch((e) => {
    console.error("バックフィル失敗:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
