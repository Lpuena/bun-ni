#!/usr/bin/env bun
import { colors } from '../utils/colors';
import { 
  checkProjectValid,
  detectPackageManager,
  detectLockFile
} from '../utils/detection';
import { 
  selectPackageManager,
  confirmExecution 
} from '../utils/prompts';
import { executeCommand } from '../utils/execution';
import { packageManagers, type PackageManager, buildInstallArgs } from '../package-managers';

function parseArgs(args: string[]) {
  const packages: string[] = [];
  let dev = false;

  for (const arg of args) {
    if (arg === '-D' || arg === '--dev') {
      dev = true;
    } else if (!arg.startsWith('-')) {
      packages.push(arg);
    } else {
      throw new Error(`未知选项: ${arg}`);
    }
  }

  return { packages, dev };
}

async function runInstall() {
  try {
    const { packages, dev } = parseArgs(process.argv.slice(2));

    // 1. 验证项目
    await checkProjectValid();

    // 2. 检测包管理器
    let manager = await detectPackageManager();
    if (!manager) {
      console.log(colors.warning('⚠ 未自动检测到包管理器'));
      manager = await selectPackageManager();
    }

    // 3. 检测锁文件
    const lockFile = await detectLockFile(manager);

    // 4. 构建命令参数（不再传递 global 选项）
    const args = buildInstallArgs(manager, packages, { dev });

    // 5. 用户确认
    const confirmed = await confirmExecution(manager, args, lockFile);
    if (!confirmed) {
      console.log(colors.error('✖ 操作已取消'));
      process.exit(0);
    }

    // 6. 执行命令
    const exitCode = await executeCommand(manager, args);
    process.exit(exitCode);

  } catch (error) {
    console.log(colors.error(`✖ ${error instanceof Error ? error.message : '未知错误'}`));
    process.exit(1);
  }
}

runInstall();