import Vue from 'vue'
import Vuex from 'vuex'
import User from './user'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  modules: {
    User
  },
  plugins: [vuexLocal.plugin],
  strict: false
})
