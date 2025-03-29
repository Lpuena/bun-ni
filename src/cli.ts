#!/usr/bin/env bun
import { Command } from 'commander'
import pkg from '../package.json'
import { colors } from './utils/colors'

const program = new Command()

// `bn`：展示工具信息和快捷用法
program
  .name('bn')
  .description('A smart package manager that auto-detects your package manager')
  .version(`v${pkg.version}`, '-v, --version')
  .action(() => {
    console.log(
      colors.primary(`
  ██████╗ ███╗   ██╗
  ██╔══██╗████╗  ██║
  ██████╔╝██╔██╗ ██║
  ██╔══██╗██║╚██╗██║
  ██████╔╝██║ ╚████║
  ╚═════╝ ╚═╝  ╚═══╝ v${pkg.version}
    `),
    )

    console.log(`
  ${colors.normal('快捷命令:')}
  ${colors.command('bi <package>')}   install package
  ${colors.command('br <package>')}   remove package
    `)
  })

// 优化帮助信息
program.addHelpText(
  'afterAll',
  `
${colors.primary('示例:')}
  ${colors.command('bi lodash')}      使用自动检测的包管理器安装 lodash
  ${colors.command('br lodash')}      移除 lodash
`,
)

export { program }
