<template>
  <aside
    class="SystemLayout__sidebar sidebar--"
    :style="{width: sidebarFold? '64px' : '170px'}"
    @mouseenter="showMenu"
    @mouseleave="closeMenu"
  >
    <div class="SystemLayout__sidebar__logo">
      <img v-if="sidebarFold" class="SystemLayout__sidebar__logo--small" src="~@/assets/img/layout/logoHead2.png" alt="logo">
      <img v-else class="SystemLayout__sidebar__logo--big" src="~@/assets/img/layout/logoHead1.png" alt="logo">
    </div>
    <el-menu
      :class="{'SystemLayout__sidebar--flold': !sidebarFold}"
      :style="{width: sidebarFold? '64px' : '170px'}"
      :default-active="menuActiveName"
      :collapse="sidebarFold"
      :collapse-transition="false"
    >
      <el-menu-item
        index="home"
        @click="goHome"
      >
        <em class="iconfont factory-shouye" />
        <span>首页</span>
      </el-menu-item>
      <LeftSubMenu v-for="menu in menuList" :key="menu.id" :menu="menu" />
    </el-menu>
  </aside>
</template>

<script>
import { defineComponent } from 'vue'
import LeftSubMenu from './left-sub-menu.vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'LeftBar',
  components: {
    LeftSubMenu
  },
  props: {
    menuList: Array
  },
  setup () {
    const { menuActiveName, sidebarFold, goHome, showMenu, closeMenu } = layoutTs()

    return {
      menuActiveName,
      sidebarFold,
      goHome,
      showMenu,
      closeMenu
    }
  }
})
</script>

<style scoped>

</style>
