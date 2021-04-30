import SSOLogin from '@shinho-fe/ssologin'

export default new SSOLogin({
    NODE_ENV: process.env.NODE_ENV,
    host: process.env.VUE_APP_SYSTEM_API + process.env.VUE_APP_API_V,
    tenant: 'MDS',
    clientId: 'bab8aedd8f0111eb9c21026438001fa4',
    clientSecret: 'babce9b08f0111eb9c21026438001fa4'
})
