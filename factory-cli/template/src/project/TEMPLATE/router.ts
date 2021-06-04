import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { GET_NAV_API } from '@/api/api/index'
import { fnAddDynamicMenuRoutes, MenuList } from '@/utils/index'
import store from './store'
import SSOLogin from '@/utils/SSOLogin'

const globalMenu: Array<MenuList> = []
const globalRoutes: Array<RouteRecordRaw> = []

const mainRouter: RouteRecordRaw = {
  path: '/',
  name: 'index',
  component: () => import('@/components/layout/index.vue'),
  children: [
    { path: '/', redirect: '/home' },
    { path: '*', redirect: { path: '/404' } },
    {
      path: '/404',
      component: () => import('./pages/common/404.vue'),
      name: '404',
      meta: { title: '404' }
    },
    {
      path: '/500',
      component: () => import('./pages/common/500.vue'),
      name: '500',
      meta: { title: '500' }
    },
    {
      path: '/home',
      component: () => import('./pages/common/home.vue')
    },
    {
      path: '/system',
      component: () => import('@/components/layout/system.vue')
    }
  ]
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL + '<%= projectName %>'),
  routes: globalRoutes.concat(mainRouter)
})

let isAddDynamicMenuRoutes = false

router.beforeEach((to, from, next) => {
  if (isAddDynamicMenuRoutes) {
    return next()
  } else {
    SSOLogin.getUserInfo().then(({ data }) => {
      store.commit('common/updateUserInfo', data.data)
      GET_NAV_API({
        factory: 'mss_fake_factory',
        tenant: '<%= projectName %>'
      }).then(({data}) => {
        fnAddDynamicMenuRoutes(globalMenu.concat(data.data.menuList || []), [], router, mainRouter)
        store.commit('common/updateMenuList', globalMenu.concat(data.data.menuList || []))
        sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
        isAddDynamicMenuRoutes = true
        return next(Object.assign({}, to, {replace: true}))
      })
    })
  }
})
export function updateIsAddDynamicMenuRoutes ():void {
  isAddDynamicMenuRoutes = false
}
export default router
