import Vue from 'vue'
import App from './App.vue'
import './plugins/el'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'

Vue.config.productionTip = false
document.title = '活动管理系统'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
