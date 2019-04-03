#!/usr/bin/env node
const chalk = require('chalk')
const commander = require('commander')
const envinfo = require('envinfo')
const spawn = require('cross-spawn')
const packageJson = require('./package.json')

let projectName

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name
  })
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`)
    console.log()
    console.log(
      `    If you have any suggestions or issues using this tool please let them be known here:`
    )
    console.log(
      `      ${chalk.cyan('https://github.com/create-redux-app/issues/new')}`
    )
    console.log()
  })
  .parse(process.argv)

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:')
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  )
  console.log()
  console.log('For example:')
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-redux-app')}`)
  console.log()
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  )
  process.exit(1)
}

clone()

function clone() {
  const result = spawn.sync(
    'git',
    ['clone', 'https://github.com/ArupAus/react-app-template.git', projectName],
    { stdio: 'inherit' }
  )

  if (result.status === 0) {
    // SUCCESS
    console.log(chalk.green(`Template successfully cloned to /${projectName}.`))
  } else {
    // FAILURE
    console.error(
      chalk.red('Error something went wrong during cloning. '),
      result.error
    )
  }

  install()
}

function install() {
  process.chdir(projectName)
  const result = spawn.sync('npm', ['install'], { stdio: 'inherit' })

  if (result.status === 0) {
    // SUCCESS
    console.log(
      chalk.green('Packages successfully installed for template app.')
    )
  } else {
    // FAILURE
    console.error(
      chalk.red('Error something went wrong during package installation. '),
      result.error
    )
  }

  complete()
}

function complete() {
  console.log(
    chalk.green(
      `Redux app has been created.\r\nYou can now access your new application with command \`cd ${projectName}\`.\r\nTo see your application in action, run the command \`npm run dev\`.`
    )
  )
}
