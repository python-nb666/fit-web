const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(command) {
  try {
    console.log(`执行: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ 命令执行失败: ${command}`);
    return false;
  }
}

async function deploy() {
  console.log('🚀 开始部署流程...\n');

  // 1. 确保在 main 分支
  console.log('📍 切换到 main 分支...');
  exec('git checkout main');

  // 2. 拉取最新代码
  console.log('⬇️  拉取最新代码...');
  exec('git pull origin main');

  // 3. 打包构建
  console.log('🔨 开始构建...');
  if (!exec('npm run build')) {
    process.exit(1);
  }

  // 4. 检查 dist 目录
  if (!fs.existsSync('dist')) {
    console.error('❌ 构建失败，dist 目录不存在');
    process.exit(1);
  }

  // 5. 切换到 build 分支
  console.log('🔄 切换到 build 分支...');
  try {
    exec('git checkout build');
  } catch {
    exec('git checkout --orphan build');
  }

  // 6. 清理 build 分支
  console.log('🧹 清理 build 分支...');
  exec('git rm -rf . 2>/dev/null || true');

  // 7. 复制 dist 内容
  console.log('📋 复制构建文件...');
  exec('git checkout main -- dist');
  
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    fs.renameSync(path.join('dist', file), file);
  });
  fs.rmdirSync('dist');

  // 8. 提交并推送
  console.log('➕ 添加文件到 git...');
  exec('git add -A');

  const date = new Date().toLocaleString('zh-CN');
  console.log('💾 提交更改...');
  exec(`git commit -m "Deploy: ${date}" || echo "没有新的更改"`);

  console.log('⬆️  推送到远程仓库...');
  exec('git push origin build --force');

  // 9. 切回 main 分支
  console.log('🔙 切回 main 分支...');
  exec('git checkout main');

  console.log('\n✅ 部署完成！');
  console.log('🌐 请访问 GitHub Pages 查看效果');
}

deploy().catch(error => {
  console.error('部署失败:', error);
  process.exit(1);
});
