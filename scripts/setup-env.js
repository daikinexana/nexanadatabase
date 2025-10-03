#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Nexana Database 環境変数セットアップ\n');

  const environment = await question('環境を選択してください (local/staging/production): ');
  
  if (!['local', 'staging', 'production'].includes(environment)) {
    console.error('❌ 無効な環境です。local、staging、productionのいずれかを選択してください。');
    rl.close();
    return;
  }

  const sourceFile = `.env.${environment}.example`;
  const targetFile = `.env.${environment}`;

  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ ${sourceFile} が見つかりません。`);
    rl.close();
    return;
  }

  if (fs.existsSync(targetFile)) {
    const overwrite = await question(`⚠️  ${targetFile} は既に存在します。上書きしますか？ (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ セットアップをキャンセルしました。');
      rl.close();
      return;
    }
  }

  // ファイルをコピー
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`✅ ${targetFile} を作成しました。`);

  // 環境に応じた追加の設定
  if (environment === 'local') {
    console.log('\n📝 開発環境の設定:');
    console.log('1. .env.local ファイルを編集して、実際の値を設定してください');
    console.log('2. データベースをセットアップしてください:');
    console.log('   npx prisma generate');
    console.log('   npx prisma migrate dev');
    console.log('3. 開発サーバーを起動してください:');
    console.log('   npm run dev');
  } else if (environment === 'staging') {
    console.log('\n📝 ステージング環境の設定:');
    console.log('1. .env.staging ファイルを編集して、実際の値を設定してください');
    console.log('2. Vercelでステージング環境の環境変数を設定してください');
    console.log('3. ステージング環境にデプロイしてください');
  } else if (environment === 'production') {
    console.log('\n📝 本番環境の設定:');
    console.log('1. .env.production ファイルを編集して、実際の値を設定してください');
    console.log('2. Vercelで本番環境の環境変数を設定してください');
    console.log('3. 本番環境にデプロイしてください');
  }

  console.log('\n🔐 セキュリティの注意事項:');
  console.log('- 機密情報は絶対にGitにコミットしないでください');
  console.log('- 本番環境のキーは安全に管理してください');
  console.log('- 定期的にキーをローテーションしてください');

  rl.close();
}

setupEnvironment().catch(console.error);
