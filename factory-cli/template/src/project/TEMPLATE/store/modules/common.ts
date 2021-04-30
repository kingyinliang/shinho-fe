import { MutationTree } from 'vuex'

const state = {
  sidebarFold: true,
  menuActiveName: 'home',
  mainTabsActiveName: '',
  userInfo: {},
  menuList: [],
  dynamicMenuRoutes: [],
  mainTabs: []
}
// eslint-disable-next-line
const mutations: MutationTree<any> = {
  updateSidebarFold (state, sidebarFold):void {
    state.sidebarFold = sidebarFold
  },
  updateMainTabsActiveName (state, mainTabsActiveName):void {
    state.mainTabsActiveName = mainTabsActiveName
  },
  updateUserInfo (state, userInfo):void {
    state.userInfo = userInfo
  },
  updateMenuList (state, menuList):void {
    state.menuList = menuList
  },
  updateMenuActiveName (state, menuActiveName):void {
    state.menuActiveName = menuActiveName
  },
  updateDynamicMenuRoutes (state, dynamicMenuRoutes):void {
    state.dynamicMenuRoutes = dynamicMenuRoutes
  },
  updateMainTabs (state, mainTabs):void {
    state.mainTabs = mainTabs
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
