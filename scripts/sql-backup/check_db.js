const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // テーブルの構造を確認
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'open_calls' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Open Calls table structure:');
    console.table(result);
    
    // 実際にデータを取得して確認
    const openCalls = await prisma.openCall.findMany({
      take: 1
    });
    
    console.log('\nSample open call data:');
    console.log(JSON.stringify(openCalls[0], null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
