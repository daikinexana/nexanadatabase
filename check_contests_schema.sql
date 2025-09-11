-- contestsテーブルの現在の構造を確認
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contests' 
ORDER BY ordinal_position;


