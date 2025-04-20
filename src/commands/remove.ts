#!/usr/bin/env bun

import { runPackageCommand } from '../commandRunner'
import { buildCommandArgs } from '../packageManagers'

// 执行移除命令
runPackageCommand(
  (manager, packages) => buildCommandArgs(manager, 'remove', packages),
  {
    validatePackages: (packages) => {
      if (packages.length === 0)
        throw new Error('请指定要移除的包名')
    },
  },
)
