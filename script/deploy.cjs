const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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

// 递归复制目录
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

function cleanBuildBranch() {
  fs.readdirSync(".", { withFileTypes: true }).forEach((item) => {
    // 跳过 .git 文件夹
    if (item.name === ".git") return;

    const itemPath = path.join(".", item.name);
    // 删除文件或文件夹
    fs.rmSync(itemPath, { recursive: true, force: true });
  });
}

async function deploy() {
  console.log("🚀 开始部署流程...\n");

  exec("git checkout main");
  exec("git pull origin main");

  console.log("🔨 开始构建...");
  if (!exec("npm run build")) process.exit(1);

  if (!fs.existsSync("dist")) {
    console.error("❌ 构建失败，dist 目录不存在");
    process.exit(1);
  }

  try {
    exec("git checkout build");
  } catch {
    exec("git checkout --orphan build");
  }

  console.log("🧹 清理 build 分支...");
  cleanBuildBranch();
  fs.readdirSync(".").forEach((file) => {
    if (file !== ".git") removeDir(file);
  });

  console.log("📋 复制构建文件...");
  copyDir("dist", ".");
  removeDir("dist");

  exec("git add -A");
  const date = new Date().toLocaleString("zh-CN");
  exec(`git commit -m "Deploy: ${date}" || echo "没有新的更改"`);
  exec("git push origin build --force");

  exec("git checkout main");
  console.log("\n✅ 部署完成！");
}

deploy();
