// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App'
import router from './router'
import firebase from 'firebase'
import firebaseConfig from '@/config/firebase'
import globalStyle from '@/scss/main.scss'
import bootstrap from 'bootstrap/scss/bootstrap.scss'
import multiselectCss from 'vue-multiselect/dist/vue-multiselect.min.css'
import store from './store'

Vue.use(VueRouter)
Vue.use(Meta)
Vue.config.productionTip = false
firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({ timestampsInSnapshots: true })

let app
/* eslint-disable no-new */
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      globalStyle,
      bootstrap,
      store,
      multiselectCss,
      components: { App },
      template: '<App/>'
    })
  }
})
