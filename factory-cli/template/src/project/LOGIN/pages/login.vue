<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import loginTs from './login'

export default defineComponent({
  name: 'login',
  created (): void {
    this.init()
  },
  setup () {
    const { init } = loginTs()

    return {
      init
    }
  }
})
</script>

<style scoped>

</style>
