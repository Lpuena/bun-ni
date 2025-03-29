import { packageManagers, type PackageManager } from '../package-managers';

/**
 * 检测指定包管理器的锁文件是否存在
 * @returns 返回实际存在的锁文件名（若存在）
 */
export async function detectLockFile(manager: PackageManager): Promise<string | null> {
  for (const lockFile of packageManagers[manager].lockFiles) {
    if (await Bun.file(lockFile).exists()) {
      return lockFile;
    }
  }
  return null;
}

/**
 * 检测项目是否有效（存在 package.json）
 */
export async function checkProjectValid(): Promise<void> {
  if (!await Bun.file('package.json').exists()) {
    throw new Error('未找到 package.json 文件');
  }
}

/**
 * 自动检测当前项目使用的包管理器
 * @returns 包管理器名称或 null
 */
export async function detectPackageManager(): Promise<PackageManager | null> {
  // 按配置顺序检测所有包管理器
  for (const manager of Object.keys(packageManagers) as PackageManager[]) {
    const lockFile = await detectLockFile(manager);
    if (lockFile) return manager;
  }
  return null;
}