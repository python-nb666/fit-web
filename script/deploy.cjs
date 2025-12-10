const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * 执行命令行
 */
function exec(command) {
  try {
    console.log(`执行: ${command}`);
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(`❌ 命令执行失败: ${command}`);
    return false;
  }
}

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * 删除目录或文件
 */
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 清空 build 分支内容，保留指定名单
 */
function cleanBuildBranch() {
  // 保留的文件 / 文件夹名单
  const keepList = [".git", ".gitignore", "node_modules"];

  fs.readdirSync(".", { withFileTypes: true }).forEach((item) => {
    if (keepList.includes(item.name)) {
      console.log(`⏩ 保留: ${item.name}`);
      return;
    }
    const itemPath = path.join(".", item.name);
    fs.rmSync(itemPath, { recursive: true, force: true });
    console.log(`🗑 删除: ${item.name}`);
  });
}

/**
 * 部署流程
 */
async function deploy() {
  console.log("🚀 开始部署流程...\n");

  // 1. 切换到 main 分支并拉取最新代码
  exec("git checkout main");
  exec("git pull origin main");

  // 2. 打包构建
  console.log("🔨 开始构建...");
  if (!exec("npm run build")) process.exit(1);

  // 3. 检查 dist 是否存在
  if (!fs.existsSync("dist")) {
    console.error("❌ 构建失败，dist 目录不存在");
    process.exit(1);
  }

  // 4. 切换到 build 分支，如果不存在则创建
  try {
    exec("git checkout build");
  } catch {
    exec("git checkout --orphan build");
  }

  // 5. 清理 build 分支（保留白名单文件）
  console.log("🧹 清理 build 分支...");
  cleanBuildBranch();

  // 6. 复制 dist 构建内容到根目录
  console.log("📋 复制构建文件...");
  copyDir("dist", ".");
  removeDir("dist");

  // 7. 添加并提交
  exec("git add -A");
  const date = new Date().toLocaleString("zh-CN");
  exec(`git commit -m "Deploy: ${date}" || echo "没有新的更改"`);

  // 8. 推送到远程
  exec("git push origin build --force");

  // 9. 切回 main 分支
  exec("git checkout main");

  console.log("\n✅ 部署完成！\n🌐 现在可以去 GitHub Pages 查看效果咯～");
}

// 执行部署
deploy();
