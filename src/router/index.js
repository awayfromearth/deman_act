import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/activities'
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('@/views/Activities')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/views/Sign')
  }
]

const router = new VueRouter({
  routes
})

export default router
