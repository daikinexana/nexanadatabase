import { defineConfig } from 'prisma/config';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// 環境変数を手動で読み込む
function loadEnvFile(filePath: string): void {
  try {
    const envContent = readFileSync(filePath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      // コメント行や空行をスキップ
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;
      
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex === -1) continue;
      
      const key = trimmedLine.substring(0, equalIndex).trim();
      let value = trimmedLine.substring(equalIndex + 1).trim();
      
      // クォートを削除
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // 環境変数が設定されていない場合のみ設定
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    // ファイルが存在しない場合は無視
  }
}

// .env.localを優先的に読み込む
loadEnvFile(resolve(process.cwd(), '.env.local'));
// .env.localが存在しない場合は.envを読み込む
loadEnvFile(resolve(process.cwd(), '.env'));

export default defineConfig({
  // Prisma 6/7対応の設定
  // 環境変数は上記で明示的に読み込まれます
});
