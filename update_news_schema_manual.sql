-- ニューステーブルのスキーマ更新
-- 1. 不要なカラムを削除
ALTER TABLE news DROP COLUMN IF EXISTS content;
ALTER TABLE news DROP COLUMN IF EXISTS round;
ALTER TABLE news DROP COLUMN IF EXISTS source;
ALTER TABLE news DROP COLUMN IF EXISTS tags;
ALTER TABLE news DROP COLUMN IF EXISTS created_by;

-- 2. typeカラムをNewsTypeからTEXTに変更
-- まず、新しいTEXTカラムを追加
ALTER TABLE news ADD COLUMN type_text TEXT;

-- 既存のデータを新しいカラムにコピー（enum値を文字列に変換）
UPDATE news SET type_text = type::text;

-- 古いtypeカラムを削除
ALTER TABLE news DROP COLUMN type;

-- 新しいtypeカラムをtypeにリネーム
ALTER TABLE news RENAME COLUMN type_text TO type;

-- 3. sourceUrlカラムをsource_urlにリネーム（既存のカラムがある場合）
-- まず、既存のsourceUrlカラムがあるかチェック
-- もし存在する場合は、source_urlにリネーム
-- 存在しない場合は、新しく作成

-- 既存のsourceUrlカラムをsource_urlにリネーム（存在する場合）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'sourceUrl') THEN
        ALTER TABLE news RENAME COLUMN "sourceUrl" TO source_url;
    END IF;
END $$;

-- source_urlカラムが存在しない場合は作成
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news' AND column_name = 'source_url') THEN
        ALTER TABLE news ADD COLUMN source_url TEXT;
    END IF;
END $$;
