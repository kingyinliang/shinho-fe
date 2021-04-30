# <%= projectName %>

## Project setup

> yarn install 或 npm install

### Compiles and hot-reloads for development

根目录下建立 .env.local 文件，存放全局变量和接口 host ，内容如下， xxxx 为本机开发起的 port 号

```
# just a flag
NODE_ENV = 'local'
VUE_APP_API_V = '/v1'

# base api
VUE_APP_HOST = 'http://localhost:xxxx/'
VUE_APP_BASE_API = 'https://apimarket-dev.shinho.net.cn/df-bff'
VUE_APP_MDS_API = 'https://apimarket-dev.shinho.net.cn/xhqy-fc'

```

> yarn serve 或 npm run serve

### Compiles and minifies for production

> yarn build:prod 或 npm run build:prod

### Compiles and minifies for test

> yarn build:test 或 npm run build:prod

### Compiles and minifies for dev

> yarn build:dev 或 npm run build:dev

### Compiles and minifies for pre

> yarn build:pre 或 npm run build:pre

