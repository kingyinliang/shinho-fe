### 注意事项
本地开发
```shell
vi /etc/hosts
```

```shell
127.0.0.1 kingyinlaing.shinho.net.cn
```
chrome90下版本解决本地开发跨域带cookie问题，列如http请求https
```shell script
chrome://flags/#same-site-by-default-cookies

chrome://flags/#cookies-without-same-site-must-be-secure
```
这两项设置为Disabled，并重启浏览器

然后，访问：http://kingyinlaing.shinho.net.cn:8080/

### 使用方法

step 1. 安装

```shell
npm install @shinho-fe/ssologin
```

step 2. 使用
```javascript
import SSOLogin from "@shinho-fe/ssologin";
const ssoLogin = new SSOLogin({
    NODE_ENV: 'production',
    host: 'https://apimarket.shinho.net.cn/df-system/v1',
    clientId: '',
    clientSecret: '',
    tenant: 'MDS',
    redirectUri: ''
})

ssoLogin.getUserInfo() // 获取用户信息
ssoLogin.expiredToken(res) // 过期
ssoLogin.syncToken(userid) // 同步系统token
ssoLogin.logout() // 退出登录

```
