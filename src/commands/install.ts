#!/usr/bin/env bun

import { runPackageCommand } from '../commandRunner'
import { buildCommandArgs } from '../packageManagers'

// 解析安装命令的参数
function parseInstallArgs(args: string[]) {
  const packages: string[] = []
  let dev = false

  for (const arg of args) {
    if (arg === '-D' || arg === '--dev') dev = true
    else if (!arg.startsWith('-')) packages.push(arg)
    else throw new Error(`未知选项: ${arg}`)
  }

  return { packages, dev }
}

// 执行安装命令
runPackageCommand(
  (manager, packages, options) => buildCommandArgs(manager, 'install', packages, options),
  { argsParser: parseInstallArgs },
)
