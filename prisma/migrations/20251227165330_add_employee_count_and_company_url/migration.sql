-- AlterTable
ALTER TABLE "startup_boards" ADD COLUMN "employeeCount" TEXT,
ADD COLUMN "companyUrl" TEXT;

-- AlterTable
ALTER TABLE "startup_boards" DROP COLUMN "fundingLink",
DROP COLUMN "hiringLink",
DROP COLUMN "proposalLink",
DROP COLUMN "collaborationLink";


