<template>
  <div v-if="modelValue" class="select_system">
    <em class="select_system--close el-icon-circle-close" @click="closeDialog"/>
    <div class="select_system_main">
      <div
        v-for="item in system"
        :key="item.id"
        class="select_system_item"
        @click="goSystem(item)"
      >
        <div class="select_system_item_img" :style='"background-image: url(" + item.backgroundImgUrl + ")"'>
          <img :src="item.logoImgUrl" alt="">
        </div>
        <p>{{ item.systemName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  watch,
  toRefs,
  ref,
  getCurrentInstance
} from 'vue'
import { GET_TENANT_BY_USER_ID, UPDATE_TENANT } from '@/api/api'

export default defineComponent({
  name: 'select-system',
  props: {
    modelValue: Boolean
  },
  setup (props, { emit }) {
    const ctx = getCurrentInstance()
    const proxy = ctx.proxy

    const { modelValue } = toRefs(props)
    const system = ref([])

    const goSystem = (system) => {
      UPDATE_TENANT({
        systemCode: system.systemCode
      }).then(() => {
        localStorage.setItem('vuex', '')
        sessionStorage.setItem('systemName', system.systemCode)
        window.location.href = '/SYSTEM'
      })
    }

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    watch(modelValue, (val) => {
      if (!val) {
        return
      }
      const userInfo = sessionStorage.getItem('userInfo')
      GET_TENANT_BY_USER_ID({
        userId: userInfo.id
      }).then((res) => {
        system.value = res.data.data
        const token = proxy.$cookies.get('token')
        res.data.data.forEach((item) => {
          createProxy(item.redirectUri, token)
        })
      })
    })
    const createProxy = (redirectUri, token) => {
      const iframe = document.createElement('iframe')
      iframe.src = redirectUri + `?token=${token}`
      iframe.style = 'position: fixed; bottom: 0;left: 0; display: none'
      document.getElementsByTagName('body')[0].appendChild(iframe)
      iframe.onload = function () {
        document.body.removeChild(iframe)
      }
    }

    return {
      system,
      goSystem,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.select_system{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  background: url("~@/assets/img/layout/dialog_bg.png") no-repeat;
  background-size: 100% 100%;
  &--close{
    position: absolute;
    font-size: 32px;
    color: white;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }
  &_main{
    width: 80%;
    display: flex;
    justify-content: center;
    text-align: center;
    flex-wrap: wrap;
  }
  &_item {
    flex: 1;
    padding: 10px 30px;
    width: 220px;
    cursor: pointer;
    &_img{
      display: flex;
      align-items: center;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      margin: auto;
      background: white;
      img{
        width: 100%;
      }
    }
    p{
      margin-top: 15px;
      color: white;
      font-size: 24px;
      line-height: 32px;
      text-align: center;
    }
  }
}
</style>
