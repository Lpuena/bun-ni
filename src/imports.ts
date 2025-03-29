// core modules
export { program } from './cli';
// package managers modules
export type { PackageManager, PackageManagerConfig } from './package-managers';
export { packageManagers } from './package-managers';

// utils modules
export { 
  colors,
  checkProjectValid,
  detectPackageManager,
  confirmExecution,
  executeCommand 
} from './utils/exports';