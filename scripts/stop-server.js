#!/usr/bin/env node

/**
 * 開発サーバーを完全に停止するスクリプト
 */

const { execSync } = require('child_process');

const PORT = 3002;

console.log(`🛑 Stopping development server on port ${PORT}...`);

let stopped = false;

try {
  // ポート3002を使用しているプロセスを検出
  const command = `lsof -ti:${PORT}`;
  const pids = execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  
  if (pids) {
    const pidList = pids.split('\n').filter(pid => pid);
    console.log(`   Found ${pidList.length} process(es) on port ${PORT}`);
    
    pidList.forEach(pid => {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
        console.log(`   ✅ Stopped process ${pid}`);
        stopped = true;
      } catch (error) {
        console.log(`   ⚠️  Failed to stop process ${pid}`);
      }
    });
  }
  
  // next devプロセスも検索して停止
  try {
    execSync(`pkill -f "next dev"`, { stdio: 'pipe' });
    if (stopped) {
      console.log(`   ✅ Also stopped Next.js dev processes`);
    } else {
      console.log(`   ✅ Stopped Next.js dev processes`);
    }
    stopped = true;
  } catch (error) {
    // pkillが何も見つけられない場合（既に停止している）は正常
  }
  
  // 少し待機
  execSync('sleep 1', { stdio: 'pipe' });
  
  // 確認
  const checkPids = execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  if (checkPids) {
    console.log(`   ⚠️  Warning: Some processes may still be running`);
  } else {
    console.log(`\n✅ Development server stopped successfully`);
    console.log(`   Port ${PORT} is now free`);
  }
  
} catch (error) {
  // ポートが既に空いている場合
  if (error.status === 1 || error.code === 1) {
    console.log(`✅ Port ${PORT} is already free`);
    console.log(`   No server was running`);
  } else {
    console.error(`❌ Error stopping server: ${error.message}`);
    process.exit(1);
  }
}


