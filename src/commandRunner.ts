/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */
import type { PackageManager } from './packageManagers'
import {
  checkProjectValid,
  colors,
  confirmExecution,
  detectLockFile,
  detectPackageManager,
  executeCommand,
  selectPackageManager,
} from './utils/exports'

// 构建命令参数的函数类型
type ArgsBuilder = (
  manager: PackageManager,
  packages: string[],
  options?: any
) => string[]

interface CommandOptions {
  argsParser?: (args: string[]) => { packages: string[], [key: string]: any }
  validatePackages?: (packages: string[]) => void
}

// 通用的包管理命令执行器
export async function runPackageCommand(
  argsBuilder: ArgsBuilder,
  options?: CommandOptions,
) {
  try {
    // 1. 解析命令行参数
    const rawArgs = Bun.argv.slice(2)
    const { packages, ...rest } = options?.argsParser?.(rawArgs) || { packages: rawArgs }

    // 2. 验证包名参数
    options?.validatePackages?.(packages)

    // 3. 检查项目环境并检测包管理器
    await checkProjectValid()
    let manager = await detectPackageManager()
    if (!manager) {
      console.log(colors.warning('⚠ 未自动检测到包管理器'))
      manager = await selectPackageManager()
    }
    const lockFile = await detectLockFile(manager)

    // 4. 构建命令参数
    const args = argsBuilder(manager, packages, rest)

    // 5. 确认并执行命令
    const confirmed = await confirmExecution(manager, args, lockFile)
    if (!confirmed) {
      console.log(colors.error('✖ 操作已取消'))
      process.exit(0)
    }

    const exitCode = await executeCommand(manager, args)
    process.exit(exitCode)
  } catch (error) {
    console.log(colors.error(`✖ ${error instanceof Error ? error.message : '未知错误'}`))
    process.exit(1)
  }
}
