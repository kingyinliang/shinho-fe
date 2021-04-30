import { createStore } from 'vuex'
import common from './modules/common'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  modules: {
    common
  },
  plugins: [vuexLocal.plugin]
})
