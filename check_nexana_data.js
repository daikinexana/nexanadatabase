const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNexanaData() {
  try {
    console.log('=== 全施設データの確認 ===');
    const allFacilities = await prisma.facility.findMany({
      select: {
        id: true,
        title: true,
        isDropinAvailable: true,
        isNexanaAvailable: true,
        isActive: true,
        area: true,
        organizer: true
      }
    });

    console.log(`総施設数: ${allFacilities.length}`);
    console.log('\n=== アクティブな施設 ===');
    const activeFacilities = allFacilities.filter(f => f.isActive);
    console.log(`アクティブな施設数: ${activeFacilities.length}`);

    console.log('\n=== ドロップイン可能施設 ===');
    const dropinFacilities = activeFacilities.filter(f => f.isDropinAvailable);
    console.log(`ドロップイン可能施設数: ${dropinFacilities.length}`);
    dropinFacilities.forEach(f => {
      console.log(`- ${f.title} (${f.area}) - ${f.organizer}`);
    });

    console.log('\n=== nexana設置施設 ===');
    const nexanaFacilities = activeFacilities.filter(f => f.isNexanaAvailable);
    console.log(`nexana設置施設数: ${nexanaFacilities.length}`);
    nexanaFacilities.forEach(f => {
      console.log(`- ${f.title} (${f.area}) - ${f.organizer}`);
    });

    console.log('\n=== 全施設の詳細 ===');
    allFacilities.forEach(f => {
      console.log(`- ${f.title} | アクティブ: ${f.isActive} | ドロップイン: ${f.isDropinAvailable} | nexana: ${f.isNexanaAvailable}`);
    });

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNexanaData();
