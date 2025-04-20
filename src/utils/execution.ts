/* eslint-disable no-console */
import type { PackageManager } from '../packageManagers'
// src/utils/execution.ts
import { colors } from './colors'

export async function executeCommand(
  manager: PackageManager,
  commands: string[],
): Promise<number> {
  const fullCommand = [manager, ...commands]

  console.log(
    [
      colors.success('开始执行:'),
      colors.command(fullCommand.join(' ')),
      '',
    ].join('\n'),
  )

  try {
    const process = Bun.spawn(fullCommand, {
      stdout: 'inherit',
      stderr: 'inherit',
      env: {
        ...Bun.env,
        FORCE_COLOR: '1',
      },
    })

    const exitCode = await process.exited
    console.log(colors.success(`\n 命令执行完成 (退出码: ${exitCode})`))
    return exitCode
  }
  catch (error) {
    console.log(
      colors.error(
        `\n 执行失败: ${error instanceof Error ? error.message : '未知错误'}`,
      ),
    )
    return 1
  }
}
