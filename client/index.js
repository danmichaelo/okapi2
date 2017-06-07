import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource';
import App from './App.vue'
import SearchResults from './SearchResults.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.debug = true

const router = new VueRouter({
  routes: [
    { path: '/', component: App,
      children: [
        {
          path: 'search',
          component: SearchResults
        },
      ]
    }
  ]
})

const app = new Vue({
  router: router
}).$mount('#app')
