#!/usr/bin/env bun

import { runPackageCommand } from '../commandRunner'

// 构建运行 dev 命令的参数
function buildRunDevArgs(manager: string, args: string[]): string[] {
  return ['run', 'dev', ...args]
}

// 执行 bd 命令
runPackageCommand(
  (manager, _, options) => buildRunDevArgs(manager, options.rawArgs || []),
  {
    argsParser: (args) => ({ rawArgs: args, packages: [] }),
    validatePackages: () => {
      // 对于 run dev 命令，不需要额外的包名验证
    },
  },
)