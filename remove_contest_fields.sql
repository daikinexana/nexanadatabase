-- 金額、主催者タイプ、運営企業URLカラムを削除
ALTER TABLE contests DROP COLUMN IF EXISTS "amount";
ALTER TABLE contests DROP COLUMN IF EXISTS "organizerType";
ALTER TABLE contests DROP COLUMN IF EXISTS "operatingCompanyUrl";
