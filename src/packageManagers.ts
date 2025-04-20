export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

interface CommandTemplates {
  install: string
  add: string
  devFlag: string
  remove: string
}

export interface PackageManagerConfig {
  lockFiles: string[]
  command: string
  commands: CommandTemplates
}

export const packageManagers: Record<PackageManager, PackageManagerConfig> = {
  npm: {
    lockFiles: ['package-lock.json'],
    command: 'npm',
    commands: {
      install: 'install',
      add: 'install',
      devFlag: '--save-dev',
      remove: 'uninstall',
    },
  },
  yarn: {
    lockFiles: ['yarn.lock'],
    command: 'yarn',
    commands: {
      install: 'install',
      add: 'add',
      devFlag: '-D',
      remove: 'remove',
    },
  },
  pnpm: {
    lockFiles: ['pnpm-lock.yaml'],
    command: 'pnpm',
    commands: {
      install: 'install',
      add: 'add',
      devFlag: '-D',
      remove: 'remove',
    },
  },
  bun: {
    lockFiles: ['bun.lockb', 'bun.lock'],
    command: 'bun',
    commands: {
      install: 'install',
      add: 'add',
      devFlag: '-D',
      remove: 'remove',
    },
  },
} as const



// 构建通用命令参数
export function buildCommandArgs(
  manager: PackageManager,
  commandType: 'install' | 'remove',
  packages: string[],
  options: { dev?: boolean } = {},
): string[] {
  const { commands } = packageManagers[manager]

  if (commandType === 'install') {
    // 安装命令逻辑
    if (packages.length === 0) return [commands.install]
    return [commands.add, ...packages, ...(options.dev ? [commands.devFlag] : [])]
  }

  if (commandType === 'remove') {
    // 移除命令逻辑
    return [commands.remove, ...packages]
  }

  throw new Error(`未知的命令类型: ${commandType}`)
}
