// src/utils/prompts.ts
import type { PackageManager, PackageManagerConfig } from '../package-managers'
import { confirm, select } from '@inquirer/prompts'
import { packageManagers } from '../package-managers'
import { colors } from './colors'
import { detectLockFile } from './detection'

export async function selectPackageManager(): Promise<PackageManager> {
  const choices = await Promise.all(
    (
      Object.entries(packageManagers) as [
        PackageManager,
        PackageManagerConfig,
      ][]
    ).map(async ([manager, config]) => {
      const lockFile = await detectLockFile(manager)

      return {
        value: manager,
        name: [
          colors.command(manager.padEnd(6)),
          colors.normal(`(${config.lockFiles.join(' | ')})`),
          lockFile
            ? colors.success(`[检测到: ${lockFile}]`)
            : colors.error('[未检测到]'),
        ].join(' '),
      }
    }),
  )

  return await select({
    message: '请选择包管理器:',
    choices,
  })
}

export async function confirmExecution(
  manager: PackageManager,
  commands: string[],
  lockFile: string | null, // 新增第三个参数
): Promise<boolean> {
  const lockFileMsg = lockFile
    ? colors.success(lockFile)
    : colors.warning('无锁文件')

  return await confirm({
    message: [
      colors.warning('即将执行:'),
      `包管理器: ${colors.highlight(manager)}`,
      `检测文件: ${lockFileMsg}`,
      `执行命令: ${colors.command([manager, ...commands].join(' '))}`,
    ].join('\n'),
    default: true,
  })
}
