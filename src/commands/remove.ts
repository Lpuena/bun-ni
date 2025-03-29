#!/usr/bin/env bun
/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */
import type { PackageManager } from '../package-managers'
import { packageManagers } from '../package-managers'
import { colors } from '../utils/colors'
import { checkProjectValid, detectLockFile, detectPackageManager } from '../utils/detection'
import { executeCommand } from '../utils/execution'
import { confirmExecution, selectPackageManager } from '../utils/prompts'

// 移除操作的命令构建器（与install风格一致）
function buildRemoveArgs(
  manager: PackageManager,
  packages: string[],
): string[] {
  return [packageManagers[manager].commands.remove, ...packages]
}

async function runRemove() {
  try {
    const packages = Bun.argv.slice(2)

    if (packages.length === 0) {
      throw new Error('请指定要移除的包名')
    }

    // 1. 验证项目
    await checkProjectValid()

    // 2. 自动检测包管理器
    let manager = await detectPackageManager()
    if (!manager) {
      console.log(colors.warning('⚠ 未自动检测到包管理器'))
      manager = await selectPackageManager()
    }

    // 3. 检测锁文件（用于提示用户）
    const lockFile = await detectLockFile(manager)

    // 4. 构建命令参数
    const args = buildRemoveArgs(manager, packages)

    // 5. 用户确认
    const confirmed = await confirmExecution(manager, args, lockFile)
    if (!confirmed) {
      console.log(colors.error('✖ 操作已取消'))
      process.exit(0)
    }

    // 6. 执行命令
    const exitCode = await executeCommand(manager, args)
    process.exit(exitCode)
  }
  catch (error) {
    console.log(
      colors.error(`✖ ${error instanceof Error ? error.message : '未知错误'}`),
    )
    process.exit(1)
  }
}

// 启动移除流程
runRemove()
