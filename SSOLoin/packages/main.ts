import VueCookies from './vue-cookies'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

function parse(search?: string) {
    if (search) {
        return JSON.parse('{"'.concat(decodeURIComponent(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/[=]/g, '":"'), '"}'))
    }
    return {}

}

const locationQuery = parse(location.search)

if (locationQuery.token) {
    VueCookies.set('token', locationQuery.token)
}

interface Option {
    NODE_ENV?: string;
    host: string;
    tenant: string;
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
}

const defaultOption: Option = {
    NODE_ENV: 'production',
    host: 'https://apimarket.shinho.net.cn/df-system/v1',
    clientId: '',
    clientSecret: '',
    tenant: 'MDS',
    redirectUri: ''
}

class SSOLogin {
    option: Option
    Axios: AxiosInstance

    constructor(option: Option) {
        if (locationQuery.token) {
            VueCookies.set('token', locationQuery.token)
        }
        this.option = {
            ...defaultOption,
            ...option
        }
        this.Axios = axios.create({
            baseURL: this.option.host,
            timeout: 30000,
            withCredentials: true
        })
        this.Axios.interceptors.request.use(config => {
            // if (VueCookies.get('token')) {
            //     config.headers.Authorization = VueCookies.get('token')
            // }
            return config
        }, error => Promise.reject(error))
        this.Axios.interceptors.response.use(res => {
            if (res.data.code === 401) {
                this.expiredToken(res.data)
                return Promise.resolve(res)
            }
            return Promise.resolve(res)
        })
    }

    async getUserInfo(): Promise<AxiosResponse> {
        return this.Axios.post('/sysUser/login', {
            tenant: this.option.tenant
        }).then((data) => {
            // 存给当前token
            VueCookies.set('token', data.data.data.token)
            return data
        })
    }

    async logout(): Promise<AxiosResponse> {
        return this.Axios.get('/sysUser/quit').then((res) => {
            VueCookies.remove('token')
            return res
        })
    }

    expiredToken(res: any) {
        let params = `&clientId=${this.option.clientId}&clientSecret=${this.option.clientSecret}&redirectUri=`
        if (this.option.redirectUri) {
            params += this.option.redirectUri
        } else {
            params += window.location.href
        }
        // if (this.option.NODE_ENV !== 'production') {
        //     const url = res.data
        //     const pos = url.indexOf('://')
        //     const root = url.substring(pos, url.length)
        //     const resUrl = 'http' + root
        //     window.location.href = resUrl + params
        // } else {
        //     window.location.href = res.data + params
        // }
        window.location.href = res.data + params
    }

    syncToken(id: string) {
        this.Axios.get('/sysTenant/queryUserTenant', { params: { userId: id } }).then(({ data }) => {
            const token = VueCookies.get('token')
            data.data.forEach((item: any) => {
                this.createProxy(item.redirectUri, token)
            })
        })
    }

    createProxy(redirectUri: string, token: string) {
        const iframe: any = document.createElement('iframe')
        iframe.src = redirectUri + `?token=${token}`
        iframe.style = 'position: fixed; bottom: 0;left: 0; display: none'
        document.getElementsByTagName('body')[0].appendChild(iframe)
        iframe.onload = function() {
            document.body.removeChild(iframe)
        }
    }
}

export default SSOLogin
