<template>
  <el-submenu v-if="getChildren" :index="String(menu.id)">
    <template #title @click="gotoRouteHandle(menu)">
      <em :class="menu.menuIcon || ''" class="iconfont" />
      <span>{{ menu.menuName }}</span>
    </template>
    <LeftSubMenu v-for="menuItem in menu.list" :key="menuItem.id" :menu="menuItem" />
  </el-submenu>
  <div v-else-if="menu.menuType !== 'P'">
    <el-menu-item :index="String(menu.id)" @click="gotoRouteHandle(menu)">
      <em :class="menu.menuIcon || ''" class="iconfont" />
      <span>{{ menu.menuName }}</span>
    </el-menu-item>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import LeftSubMenu from './left-sub-menu.vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'LeftSubMenu',
  props: {
    menu: Object
  },
  components: {
    LeftSubMenu
  },
  setup (props) {
    const { gotoRouteHandle } = layoutTs()
    const getChildren = computed(() => {
      let tmp = false
      if (props.menu.list && props.menu.list.length > 0 && props.menu.list.filter(item => item.menuType !== 'P').length > 0) {
        tmp = true
      }
      return tmp
    })
    return {
      getChildren,
      gotoRouteHandle
    }
  }
})
</script>

<style scoped>

</style>
