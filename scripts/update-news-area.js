const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateNewsArea() {
  try {
    // 既存のニュースデータにareaフィールドを追加
    const newsItems = await prisma.news.findMany({
      where: {
        area: null
      }
    });

    console.log(`Found ${newsItems.length} news items without area field`);

    for (const item of newsItems) {
      let area = '東京都'; // デフォルト値
      
      // 企業名に基づいてエリアを設定
      if (item.company.includes('VUILD')) {
        area = '東京都';
      } else if (item.company.includes('ドクターズプライム')) {
        area = '大阪府';
      } else if (item.company.includes('そうそう')) {
        area = '東京都';
      }

      await prisma.news.update({
        where: { id: item.id },
        data: { area: area }
      });

      console.log(`Updated ${item.title} with area: ${area}`);
    }

    console.log('News area fields updated successfully!');
  } catch (error) {
    console.error('Error updating news area:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateNewsArea();
