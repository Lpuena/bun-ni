#!/usr/bin/env bun
import { Command } from 'commander';
import { colors } from './imports';
import pkg from '../package.json';

const program = new Command();

// `bn`：展示工具信息和快捷用法
program
  .name('bn')
  .description('A smart package manager that auto-detects your package manager')
  .version(`v${pkg.version}`, '-v, --version')
  .action(() => {
    console.log(colors.primary(`
  ██████╗ ███╗   ██╗
  ██╔══██╗████╗  ██║
  ██████╔╝██╔██╗ ██║
  ██╔══██╗██║╚██╗██║
  ██████╔╝██║ ╚████║
  ╚═════╝ ╚═╝  ╚═══╝ v${pkg.version}
    `));

    console.log(`
  ${colors.primary('快捷命令:')}
  ${colors.command('bni <package>')}   install package
  ${colors.command('bnr <package>')}   remove package
    `);
  });



// 优化帮助信息
program.addHelpText('afterAll', `
${colors.primary('示例:')}
  ${colors.command('bni lodash')}      使用自动检测的包管理器安装 lodash
  ${colors.command('bnr lodash')}      移除 lodash
`);

export { program };