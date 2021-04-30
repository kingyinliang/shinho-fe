import { ComponentInternalInstance, computed, getCurrentInstance, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute, Router, RouteLocationNormalizedLoaded, RouteLocationNormalized } from 'vue-router'
import { WritableComputedRef } from '@vue/reactivity'
import { USER_QUIT_API } from '@/api/api'

// eslint-disable-next-line
type Fn<T> = (ctx?: any) => T

interface LayoutTs<T> {
  systemVisible: Ref<boolean>
  router: Router
  route: RouteLocationNormalizedLoaded
  userInfo: WritableComputedRef<T>
  menuList: WritableComputedRef<T>
  menuActiveName: WritableComputedRef<T>
  sidebarFold: WritableComputedRef<T>
  dynamicMenuRoutes: WritableComputedRef<T>
  keepAlivePages: WritableComputedRef<T>
  mainTabs: WritableComputedRef<T>
  mainTabsActiveName: WritableComputedRef<T>
  gotoRouteHandle: Fn<T>
  routeHandle: Fn<T>
  quit: Fn<T>
  showMenu: Fn<T>
  goHome: Fn<T>
  selectedTabHandle: Fn<T>
  removeTabHandle: Fn<T>
  tabsCloseCurrentHandle: Fn<T>
  tabsCloseOtherHandle: Fn<T>
  tabsCloseAllHandle: Fn<T>
  tabsRefreshCurrentHandle: Fn<T>
  closeMenu: Fn<T>
}
interface Meta {
  menuId: string
}
interface DynamicMenuRoute {
  name: string
  path: string
  meta: Meta
}
interface MainTabs {
  menuId: string
  name: string
  title: string
  type: string
  iframeUrl: string
  componentName: string
  props?: MainTabs
}

// eslint-disable-next-line
export default function (): LayoutTs<any> {
  const ctx = getCurrentInstance() as ComponentInternalInstance
  // eslint-disable-next-line
  const proxy = ctx.proxy as any
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const systemVisible = ref(false)

  const userInfo = computed({
    get: () => store.state.common.userInfo,
    set: val => store.commit('common/updateUserInfo', val)
  })

  const menuList = computed({
    get: () => store.state.common.menuList,
    set: val => store.commit('common/updateMenuList', val)
  })

  const sidebarFold = computed({
    get: () => store.state.common.sidebarFold,
    set: val => store.commit('common/updateSidebarFold', val)
  })

  const menuActiveName = computed({
    get: () => store.state.common.menuActiveName,
    set: val => store.commit('common/updateMenuActiveName', val)
  })

  const dynamicMenuRoutes: WritableComputedRef<DynamicMenuRoute[]> = computed({
    get: () => store.state.common.dynamicMenuRoutes,
    set: val => store.commit('common/updateDynamicMenuRoutes', val)
  })

  const mainTabs: WritableComputedRef<MainTabs[]> = computed({
    get: () => store.state.common.mainTabs,
    set: val => store.commit('common/updateMainTabs', val)
  })

  const mainTabsActiveName = computed({
    get: () => store.state.common.mainTabsActiveName,
    set: val => store.commit('common/updateMainTabsActiveName', val)
  })

  const keepAlivePages = computed(() => {
    const num = mainTabs.value.reduce((previousValue, currentValue, i) => {
      if (i === 0) {
        return previousValue + currentValue.componentName
      } else {
        return previousValue + ',' + currentValue.componentName
      }
    }, '')
    return num
  })

  // tabs，切换tab
  const selectedTabHandle = (tab:MainTabs) => {
    const finalTab = mainTabs.value.filter(item => item.name === tab.props?.name)
    if (finalTab.length >= 1) {
      router.push(finalTab[0].name)
    }
  }

  // tabs, 点击删除
  const removeTabHandle = async (tabName: string, add = false) => {
    mainTabs.value = mainTabs.value.filter(item => item.name !== tabName)
    if (add) {
      router.push('/').then(() => {
        router.push({ name: tabName })
      })
    } else if (mainTabs.value.length >= 1) {
      // 当前选中tab被删除
      if (tabName === mainTabsActiveName.value) {
        mainTabsActiveName.value = mainTabs.value[mainTabs.value.length - 1].name
        router.push({ name: mainTabs.value[mainTabs.value.length - 1].name })
      }
    } else {
      menuActiveName.value = 'home'
      router.push('/home')
    }
  }

  // tabs, 关闭当前
  const tabsCloseCurrentHandle = () => {
    removeTabHandle(mainTabsActiveName.value)
  }

  // tabs, 关闭其它
  const tabsCloseOtherHandle = () => {
    mainTabs.value = mainTabs.value.filter(item => item.name === mainTabsActiveName.value)
  }

  // tabs, 关闭全部
  const tabsCloseAllHandle = () => {
    mainTabs.value = []
    menuActiveName.value = 'home'
    router.push('home')
  }

  // tabs, 刷新当前
  const tabsRefreshCurrentHandle = async () => {
    const tempTabName = mainTabsActiveName.value
    // const tempTab = mainTabs.value.find(item => item.name === tempTabName)
    // mainTabs.value = mainTabs.value.filter(item => item.name !== tempTabName)
    // await nextTick()
    // mainTabs.value.push(tempTab as MainTabs)
    removeTabHandle(tempTabName, true)
  }

  // 展开菜单
  const showMenu = () => {
    sidebarFold.value = false
  }

  // 折叠菜单
  const closeMenu = () => {
    sidebarFold.value = true
  }

  // 去首页
  const goHome = () => {
    menuActiveName.value = 'home'
    router.push('/home')
  }

  // 菜单点击
  const gotoRouteHandle = (menu: { id:'' }) => {
    const route = dynamicMenuRoutes.value.filter(item => item && item.meta.menuId === menu.id)
    if (route.length >= 1) {
      router.push(route[0].path)
    }
  }

  // 监听路由添加tabs
  const routeHandle = (route: RouteLocationNormalized) => {
    if (route.meta.isTab) {
      let tab = mainTabs.value.filter(item => item.name === route.name)[0]
      if (!tab) {
        if (route.meta.isDynamic) {
          if (!dynamicMenuRoutes.value.filter(item => item.name === route.name)[0]) {
            return
          }
        }
        tab = {
          componentName: route.meta.componentName as string,
          menuId: (route.meta.menuId || route.name) as string,
          name: route.name as string,
          title: route.meta.title as string,
          type: 'module',
          iframeUrl: (route.meta.iframeUrl || '') as string
        }
        mainTabs.value = mainTabs.value.concat(tab)
      }
      menuActiveName.value = String(tab.menuId)
      mainTabsActiveName.value = tab.name
    }
  }

  const quit = () => {
    proxy.$confirm('确定进行[退出]操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      USER_QUIT_API().then(() => {
        proxy.$cookies.remove('token')
        window.location.href = `${process.env.VUE_APP_HOST}`
      })
    })
  }

  return {
    systemVisible,
    router,
    route,
    userInfo,
    menuList,
    menuActiveName,
    mainTabsActiveName,
    sidebarFold,
    dynamicMenuRoutes,
    mainTabs,
    keepAlivePages,
    quit,
    removeTabHandle,
    selectedTabHandle,
    tabsCloseCurrentHandle,
    tabsCloseOtherHandle,
    tabsCloseAllHandle,
    tabsRefreshCurrentHandle,
    routeHandle,
    gotoRouteHandle,
    goHome,
    showMenu,
    closeMenu
  }
}
