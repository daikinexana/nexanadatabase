-- contestsテーブルにorganizerTypeカラムを追加
ALTER TABLE "contests"
ADD COLUMN "organizerType" TEXT;

-- 既存のレコードにデフォルト値を設定
UPDATE "contests"
SET "organizerType" = 'その他'
WHERE "organizerType" IS NULL;
