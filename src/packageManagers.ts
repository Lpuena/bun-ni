export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

interface CommandTemplates {
  install: string
  /** 添加依赖包 */
  add: string
  devFlag: string
  remove: string // 新增移除命令
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
      add: 'install', // npm 使用 install 添加包
      devFlag: '--save-dev', // npm 的开发依赖标志
      remove: 'uninstall', // npm 使用 uninstall 移除包
    },
  },
  yarn: {
    lockFiles: ['yarn.lock'],
    command: 'yarn',
    commands: {
      install: 'install',
      add: 'add', // yarn 使用 add
      devFlag: '-D', // yarn 的开发依赖标志
      remove: 'remove', // yarn 使用 remove 移除包
    },
  },
  pnpm: {
    lockFiles: ['pnpm-lock.yaml'],
    command: 'pnpm',
    commands: {
      install: 'install',
      add: 'add', // pnpm 使用 add
      devFlag: '-D', // pnpm 的开发依赖标志
      remove: 'remove', // pnpm 使用 remove 移除包
    },
  },
  bun: {
    lockFiles: ['bun.lockb', 'bun.lock'],
    command: 'bun',
    commands: {
      install: 'install',
      add: 'add', // bun 使用 add
      devFlag: '-D', // bun 的开发依赖标志
      remove: 'remove', // bun 使用 remove 移除包
    },
  },
} as const

// 通用命令构建器
export function buildInstallArgs(
  manager: PackageManager,
  packages: string[],
  options: { dev?: boolean, global?: boolean },
): string[] {
  const { commands } = packageManagers[manager]

  if (packages.length === 0) {
    return [commands.install]
  }

  const baseArgs = commands.add.split(' ')
  return [...baseArgs, ...packages, ...(options.dev ? [commands.devFlag] : [])]
}
