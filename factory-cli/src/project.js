const inquirer = require('inquirer')
const fs = require('fs')
const fse = require('fs-extra')
const ora = require('ora')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')
const { getDirFileName, INJECT_FILES } = require('./utils')
const path = require('path')
const chalk = require('chalk')
const { exec } = require('child_process')

const defaultOption = {
    projectName: '',
    description: ''
}
class Project {
    config
    memFsEditor

    constructor(option) {
        this.config = {
            ...defaultOption,
            ...option
        }
        this.memFsEditor = editor.create(memFs.create())
    }

    create() {
        this.inquire().then((answer) => {
            this.config = {
                ...this.config,
                ...answer
            };
            this.generate()
        }).catch(error => {
            console.log(error, 'inquire error')
        })
    }

    inquire() {
        const prompts = []
        const { projectName, description } = this.config
        if (typeof projectName !== 'string') {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '请输入项目名：',
                validate: function(input) {
                    if (!input) {
                        return '项目名不能为空'
                    }
                    if (fs.existsSync(input)) {
                        return '当前目录已存在同名项目，请更换项目名'
                    }
                    return true
                }
            });
        } else if (fs.existsSync(projectName)) {
            prompts.push({
                type: 'input',
                name: 'projectName',
                message: '当前目录已存在同名项目，请更换项目名',
                validate(input) {
                    if (!input) {
                        return '项目名不能为空'
                    }
                    if (fs.existsSync(input)) {
                        return '当前目录已存在同名项目，请更换项目名'
                    }
                    return true
                }
            })
        }
        if (typeof description !== 'string') {
            prompts.push({
                type: 'input',
                name: 'description',
                message: '请输入项目描述'
            })
        }
        return inquirer.prompt(prompts)
    }

    generate() {
        const { projectName, description } = this.config
        const templatePath = path.join(__dirname, '../template')
        const projectPath = path.join(process.cwd(), projectName)

        const copyFiles = getDirFileName(templatePath)

        // 复制文件
        copyFiles.forEach((file) => {
            fse.copySync(path.join(templatePath, file), path.join(projectPath, file))
            console.log(`${chalk.green('✔ ')}${chalk.grey(`创建: ${projectName}/${file}`)}`)
        })

        // 模板替换
        INJECT_FILES.forEach((file) => {
            this.memFsEditor.copyTpl(path.join(templatePath, file), path.join(projectName, file), {
                projectName,
                description
            })
        })

        // 重命名文件
        fse.renameSync(path.join(projectName, 'src/project/TEMPLATE'), path.join(projectName, `src/project/${projectName}`))

        this.memFsEditor.commit(() => {
            INJECT_FILES.forEach((file) => {
                console.log(`${chalk.green('✔ ')}${chalk.grey(`模板替换: ${projectName}/${file}`)}`);
            })

            process.chdir(projectPath)

            // git 初始化
            const gitInitSpinner = ora(`cd ${chalk.green.bold(projectName)}目录, 执行 ${chalk.green.bold('git init')}`)
            gitInitSpinner.start()
            const gitInit = exec('git init')
            gitInit.on('close', (code) => {
                if (code === 0) {
                    gitInitSpinner.color = 'green';
                    gitInitSpinner.succeed(gitInit.stdout.read())
                } else {
                    gitInitSpinner.color = 'red';
                    gitInitSpinner.fail(gitInit.stderr.read())
                }
            })

            // 安装项目依赖
            const installSpinner = ora(`安装项目依赖 ${chalk.green.bold('npm install')}, 请稍后...`)
            installSpinner.start()
            exec('npm install', (error, stdout, stderr) => {
                if (error) {
                    installSpinner.color = 'red'
                    installSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'))
                    console.log(error)
                } else {
                    console.log(`${stderr}${stdout}`)
                    installSpinner.color = 'green'
                    installSpinner.succeed('安装依赖成功')

                    console.log(chalk.green('创建项目成功！'))
                    console.log(chalk.green('Let\'s Coding吧！嘿嘿😝'))
                }
            })
        })
    }
}
module.exports = Project
