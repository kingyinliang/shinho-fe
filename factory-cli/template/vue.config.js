const path = require('path')

const pages = {
  index: {
    title: '<%= description %>',
    entry: 'src/project/LOGIN/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    chunk: ['chunk-vendors', 'chunk-common', 'index']
  },
  <%= projectName %>: {
    title: '<%= description %>',
    entry: 'src/project/<%= projectName %>/main.ts',
    template: 'public/index.html',
    filename: '<%= projectName %>.html',
    chunk: ['chunk-vendors', 'chunk-common', '<%= projectName %>']
  }
}

const configureWebpack = {
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  }
}

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  pages,
  configureWebpack
}
