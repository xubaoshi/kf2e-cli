const inquirer = require('inquirer')
const fse = require('fs-extra')
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')
const path = require('path')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')
const { exec } = require('child_process')
const { getDirFileName } = require('./utils')
const { INJECT_FILES } = require('./constants')

function Project(options) {
  this.config = Object.assign(
    {
      projectName: '',
      description: '',
      template: '',
      author: ''
    },
    options
  )
  const store = memFs.create()
  this.memFsEditor = editor.create(store)
}

Project.prototype.create = function() {
  this.inquire().then(answer => {
    this.config = Object.assign(this.config, answer)
    this.config.template =
      'direct:https://github.com/xubaoshi/user-analysis.git'
    this.generate()
  })
}

Project.prototype.inquire = function() {
  const prompts = []
  const { projectName, description, author } = this.config
  if (projectName === '') {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'Please input project name:',
      validate(input) {
        if (!input) {
          return 'Project name must not null'
        }
        if (fse.existsSync(input)) {
          return `The folder ${input} is exist, please change one`
        }
        return true
      }
    })
  } else if (fse.existsSync(projectName)) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: `The folder ${projectName} is exist, please change one`,
      validate(input) {
        if (!input) {
          return 'Project name must not null'
        }
        if (fse.existsSync(input)) {
          return `The folder ${input} is exist, please change one`
        }
        return true
      }
    })
  }

  if (description === '') {
    prompts.push({
      type: 'input',
      name: 'description',
      message: 'Please input project desc'
    })
  }

  if (author === '') {
    prompts.push({
      type: 'input',
      name: 'author',
      message: 'Please input author'
    })
  }

  return inquirer.prompt(prompts)
}

/**
 * 模板替换
 * @param {string} source 源文件路径
 * @param {string} dest 目标文件路径
 * @param {object} data 替换文本字段
 */
Project.prototype.injectTemplate = function(source, dest, data) {
  this.memFsEditor.writeJSON(
    dest,
    Object.assign({}, this.memFsEditor.readJSON(source), data)
  )
}

Project.prototype.generate = function() {
  const { projectName, description, author, template } = this.config
  const projectPath = path.join(process.cwd(), projectName)
  const downloadPath = path.join(projectPath, '__download__')

  const downloadSpinner = ora('🚀  Downloading template...')
  downloadSpinner.start()
  // 下载git repo
  download(template, downloadPath, { clone: true }, err => {
    if (err) {
      downloadSpinner.color = 'red'
      downloadSpinner.fail(err.message)
      downloadSpinner.fail(
        `please check your network, make sure can access to template ${template}`
      )
      fse.remove(downloadPath)
      fse.remove(projectPath)
      return
    }

    downloadSpinner.color = 'green'
    downloadSpinner.succeed('🎉  Download Success')

    // 复制文件
    const copyFiles = getDirFileName(downloadPath)

    copyFiles.forEach(file => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file))
      console.log(
        `${chalk.green('✔ ')}${chalk.grey(`Create: ${projectName}/${file}`)}`
      )
    })

    INJECT_FILES.forEach(file => {
      this.injectTemplate(
        path.join(downloadPath, file),
        path.join(projectName, file),
        {
          name: projectName,
          description,
          author
        }
      )
    })

    this.memFsEditor.commit(() => {
      INJECT_FILES.forEach(file => {
        console.log(`🚚 ${chalk.grey(`Create: ${projectName}/${file}`)}`)
      })

      fse.remove(downloadPath)

      process.chdir(projectPath)

      // git 初始化
      console.log()
      const gitInitSpinner = ora(`⚓ git init`)
      gitInitSpinner.start()

      const gitInit = exec('git init')
      gitInit.on('close', code => {
        if (code === 0) {
          gitInitSpinner.color = 'green'
          gitInitSpinner.succeed(gitInit.stdout.read())
        } else {
          gitInitSpinner.color = 'red'
          gitInitSpinner.fail(gitInit.stderr.read())
        }

        // 安装依赖
        console.log()
        const installSpinner = ora(
          `🗃 Installing dependency. This might take a while...`
        )
        installSpinner.start()
        exec('npm install', (error, stdout, stderr) => {
          if (error) {
            installSpinner.color = 'red'
            installSpinner.fail(
              chalk.red('🔗 Dependency installed, please try again.')
            )
            console.log(error)
          } else {
            installSpinner.color = 'green'
            installSpinner.succeed('🎉 Dependency installed success.')
            console.log(`${stderr}${stdout}`)
            console.log(
              chalk.default(
                `🎉  Successfully created project ${chalk.yellow(projectName)}`
              )
            )
            console.log(
              chalk.default(`👉  Get started with the following commands:`)
            )
            console.log()
            console.log(chalk.cyan(` ${chalk.gray('$')} cd ${projectName}`))
            console.log(chalk.cyan(` ${chalk.gray('$')} npm dev`))
          }
        })
      })
    })
  })
}

module.exports = Project
