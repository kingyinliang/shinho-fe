const fs = require('fs')
const INJECT_FILES = [
    'nginx/default.conf',
    'package.json',
    'vue.config.js',
    'README.md',
]

function getDirFileName(dir) {
    try {
        const files = fs.readdirSync(dir)
        const filesToCopy = [];
        files.forEach((file) => {
            if (file.indexOf(INJECT_FILES) > -1) return
            filesToCopy.push(file)
        })
        return filesToCopy
    } catch (e) {
        return []
    }
}
module.exports = {
    getDirFileName,
    INJECT_FILES
}
