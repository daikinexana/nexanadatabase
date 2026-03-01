import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prismaクライアントの初期化
 * 
 * Neonのコスト削減のための注意事項:
 * - DATABASE_URLにNeonのpooler URLを使用することを推奨
 *   (形式: postgresql://...@ep-xxx-xxx-pooler.region.aws.neon.tech/...)
 * - Pooler URLを使用することで、Scale to zeroが正常に機能し、コストが削減されます
 * - 詳細は NEON_COST_OPTIMIZATION.md を参照してください
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
