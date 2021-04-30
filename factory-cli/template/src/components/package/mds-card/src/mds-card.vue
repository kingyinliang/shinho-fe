<template>
  <div class="k-box-card">
    <div class="k-box-card-title clearfix">
      <h3> <em class="title-icon" :style="{ background: iconBg }" />{{ title }} </h3>
      <slot name="titleBtn" />
    </div>
    <div :class="name + 'Box'">
      <slot />
    </div>
    <div v-if="packUp" class="k-box-card-show-hidden">
      <span class="showHiddenBtn" :name="name">收起 <em class="el-icon-caret-top" /></span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MdsCard',
  props: {
    packUp: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    iconBg: String,
    title: String
  },
  setup () {
    return {}
  }
})
</script>

<style scoped>

</style>
