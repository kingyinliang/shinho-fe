<template>
  <section class="SystemLayout__container system_container" :class="{'SystemLayout__container--open': !sidebarFold}">
    <el-tabs
      v-if="route.meta.isTab"
      class="SystemLayout__container__tabs"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
    >
      <el-dropdown class="SystemLayout__container__tabs__tools" :show-timeout="0">
        <em class="el-icon-arrow-down el-icon--right" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="tabsCloseCurrentHandle">
              关闭当前标签页
            </el-dropdown-item>
            <el-dropdown-item @click="tabsCloseOtherHandle">
              关闭其它标签页
            </el-dropdown-item>
            <el-dropdown-item @click="tabsCloseAllHandle">
              关闭全部标签页
            </el-dropdown-item>
            <el-dropdown-item @click="tabsRefreshCurrentHandle">
              刷新当前标签页
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      />
    </el-tabs>
    <div class="SystemLayout__container--scroll">
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAlivePages">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <div class="SystemLayout__container__footer">
      <p>Copyright @ 2018 烟台欣和企业食品有限公司版权所有</p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import layoutTs from '@/components/layout/layoutTs'

export default defineComponent({
  name: 'MainContent',
  setup () {
    const {
      route,
      sidebarFold,
      keepAlivePages,
      mainTabs,
      mainTabsActiveName,
      selectedTabHandle,
      removeTabHandle,
      tabsCloseCurrentHandle,
      tabsCloseOtherHandle,
      tabsCloseAllHandle,
      tabsRefreshCurrentHandle
    } = layoutTs()

    return {
      route,
      sidebarFold,
      keepAlivePages,
      mainTabs,
      mainTabsActiveName,
      removeTabHandle,
      selectedTabHandle,
      tabsCloseCurrentHandle,
      tabsCloseOtherHandle,
      tabsCloseAllHandle,
      tabsRefreshCurrentHandle
    }
  }
})
</script>

<style scoped>

</style>
