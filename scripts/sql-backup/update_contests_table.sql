-- 既存のテーブルを削除して再作成
DROP TABLE IF EXISTS contests CASCADE;

-- 新しいcontestsテーブルを作成
CREATE TABLE contests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT,
    deadline TIMESTAMP,
    startDate TIMESTAMP,
    area TEXT,
    organizer TEXT NOT NULL,
    organizerType TEXT NOT NULL,
    amount TEXT,
    website TEXT,
    targetArea TEXT,
    targetAudience TEXT,
    incentive TEXT,
    operatingCompany TEXT,
    operatingCompanyUrl TEXT,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL
);
