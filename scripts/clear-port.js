#!/usr/bin/env node

/**
 * ポート3002を使用しているプロセスを停止するスクリプト
 */

const { execSync } = require('child_process');

const PORT = 3002;

console.log(`🔍 Checking port ${PORT}...`);

try {
  // macOS/Linux用: lsofでポートを使用しているプロセスを検出
  const command = `lsof -ti:${PORT}`;
  const pids = execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  
  if (pids) {
    const pidList = pids.split('\n').filter(pid => pid);
    console.log(`⚠️  Found ${pidList.length} process(es) using port ${PORT}:`);
    
    pidList.forEach(pid => {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
        console.log(`   ✅ Killed process ${pid}`);
      } catch (error) {
        console.log(`   ⚠️  Failed to kill process ${pid} (may already be terminated)`);
      }
    });
    
    // 念のため少し待機
    execSync('sleep 1', { stdio: 'pipe' });
  } else {
    console.log(`✅ Port ${PORT} is free`);
  }
} catch (error) {
  // lsofが何も見つけられない場合（ポートが空いている）は正常
  if (error.status === 1 || error.code === 1) {
    console.log(`✅ Port ${PORT} is free`);
  } else {
    console.error(`❌ Error checking port: ${error.message}`);
    process.exit(1);
  }
}

console.log(`🚀 Ready to start development server on port ${PORT}`);


