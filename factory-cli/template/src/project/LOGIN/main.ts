import { createApp } from 'vue'
import AppVue from './App.vue'
import router from './router'
import VueCookies from '@/components/cookie/vue-cookies'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css'

import '@/assets/scss/index.scss'
import '@/assets/icon/iconfont.css'

const app = createApp(AppVue)

app.use(router).use(ElementPlus, { locale }).use(VueCookies).mount('#app')
