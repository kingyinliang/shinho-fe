<template>
  <el-form ref="form" :model="systemForm" size="small" label-width="150px">
    <el-form-item
      v-for="(item, index) in systemForm"
      :key="index"
      :label="item.label"
    >
      <el-color-picker v-model="item.val"  @change="colorChange(item)"/>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'system',
  setup () {
    const systemForm = ref([
      {
        val: '#487bff',
        label: '系统主色',
        scssVar: '--color-primary'
      },
      {
        val: '#00152B',
        label: '侧边栏背景色',
        scssVar: '--sidebar-bg-color'
      },
      {
        val: '#8a979e',
        label: '侧边栏字体色',
        scssVar: '--sidebar-text-color'
      },
      {
        val: '#1890ff',
        label: '侧边栏选中背景色',
        scssVar: '--sidebar-active-bg-color'
      },
      {
        val: '#00152B',
        label: '侧边栏选中字体色',
        scssVar: '--sidebar-active-text-color'
      }
    ])

    const colorChange = (item) => {
      sessionStorage.setItem('SystemColor', JSON.stringify(systemForm.value || []))
      document.getElementsByTagName('body')[0].style.setProperty(item.scssVar, item.val)
    }

    onMounted(() => {
      if (sessionStorage.getItem('SystemColor')) {
        systemForm.value = JSON.parse(sessionStorage.getItem('SystemColor'))
      }
    })

    return {
      systemForm,
      colorChange
    }
  }
})
</script>

<style scoped>

</style>
