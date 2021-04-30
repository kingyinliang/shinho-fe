import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ElNotification, ElLoading } from 'element-plus'
import VueCookies from '@/components/cookie/vue-cookies'

enum HttpCode {
  SUCCESS = 200,
  WARNING = 110,
  EXPIRED_TOKEN = 401,
  ERROR = 500,
}

export class HttpManager {
  static _instance: HttpManager
  _axios: AxiosInstance
  _needLoadingRequestCount: 0
  // eslint-disable-next-line
  _loading: any

  constructor () {
    console.log('axios初始化')
    this._axios = axios.create({
      baseURL: (process.env.VUE_APP_BFF_API as string) + (process.env.VUE_APP_API_V as string),
      timeout: 30000
      // withCredentials: true
    })
    this._needLoadingRequestCount = 0
    this._loading = {}
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  static getInstance (): HttpManager {
    this._instance || (this._instance = new HttpManager())
    return this._instance
  }

  get (url: string, params = {}, config = {}): Promise<AxiosResponse> {
    return this._axios.get(url, {
      ...config,
      params
    })
  }

  post (url: string, data = {}, config = {}): Promise<AxiosResponse> {
    return this._axios.post(url, data, config)
  }

  interceptorsRequest (): void {
    this._axios.interceptors.request.use(config => {
      if (VueCookies.get('token')) {
        config.headers.Authorization = VueCookies.get('token')
      }
      this.showFullScreenLoading() // 显示遮罩
      return config
    }, error => Promise.reject(error))
  }

  interceptorsResponse (): void {
    this._axios.interceptors.response.use(res => {
      if (res.data.code === HttpCode.SUCCESS) {
        this.tryHideFullScreenLoading() // 关闭遮罩
        return Promise.resolve(res)
      } else if (res.data.code === HttpCode.EXPIRED_TOKEN) {
        this.tryHideFullScreenLoading() // 关闭遮罩
        window.location.href = process.env.VUE_APP_HOST as string
        return Promise.reject(res)
      } else if (res.data.code === HttpCode.WARNING) {
        ElNotification({ title: '警告', message: res.data.msg, type: 'warning' })
        this.tryHideFullScreenLoading() // 关闭遮罩
        return Promise.reject(res)
      } else if (res.data.code === HttpCode.ERROR) {
        console.log(res.data.code)
        ElNotification({ title: '错误', message: res.data.msg, type: 'error', duration: 0 })
        this.tryHideFullScreenLoading() // 关闭遮罩
        return Promise.reject(res)
      } else {
        ElNotification({ title: '错误', message: res.data.msg, type: 'error', duration: 0 })
        this.tryHideFullScreenLoading() // 关闭遮罩
        return Promise.reject(res)
      }
    }, error => {
      ElNotification({ title: '错误', message: '网络请求失败，请刷新重试', type: 'error' })
      this.tryHideFullScreenLoading() // 关闭遮罩
      return Promise.reject(error)
    })
  }

  showFullScreenLoading (): void {
    if (this._needLoadingRequestCount === 0) {
      this.startLoading()
    }
    this._needLoadingRequestCount++
  }

  tryHideFullScreenLoading (): void {
    if (this._needLoadingRequestCount <= 0) return
    this._needLoadingRequestCount--
    if (this._needLoadingRequestCount === 0) {
      this.endLoading()
    }
  }

  startLoading (): void {
    this._loading = ElLoading.service({
      lock: true,
      spinner: 'loadingGif',
      text: '加载中……',
      background: 'rgba(255, 255, 255, 0.7)'
    })
  }

  endLoading (): void {
    this._needLoadingRequestCount = 0
    this._loading.close()
  }
}

export default HttpManager.getInstance()
