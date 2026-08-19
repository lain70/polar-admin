import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'adminLogin',
  component: () => import('@/views/admin/AdminLoginView.vue')
},
{
  path: '/',
  name: 'adminDashboard',
  component: () => import('@/views/admin/AdminDashboardView.vue')
},
{
  path: '/goods',
  name: 'adminGoodsList',
  component: () => import('@/views/admin/goods/AdminGoodsListView.vue')
},
{
  path: '/goods/new',
  name: 'adminGoodsCreate',
  component: () => import('@/views/admin/goods/AdminGoodsCreateView.vue')
},
{
  path: '/goods/:goodsNo',
  name: 'adminGoodsDetail',
  component: () => import('@/views/admin/goods/AdminGoodsDetailView.vue')
},
{
  path: '*',
  redirect: { name: 'adminDashboard' }
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = Boolean(localStorage.getItem('adminAccessToken'))

  if (to.name !== 'adminLogin' && !isAuthenticated) {
    next({ name: 'adminLogin' })
    return
  }

  if (to.name === 'adminLogin' && isAuthenticated) {
    next({ name: 'adminDashboard' })
    return
  }

  next()
})

export default router
