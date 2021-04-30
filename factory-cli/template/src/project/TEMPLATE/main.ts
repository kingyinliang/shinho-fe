import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import VueCookies from '@/components/cookie/vue-cookies'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import Mds from '@/components'

import '@/assets/scss/index.scss'
import '@/assets/icon/iconfont.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(AppVue)

app
  .use(router)
  .use(store)
  .use(ElementPlus, { locale })
  .use(Mds)
  .use(VueCookies)
  .mount('#app')
