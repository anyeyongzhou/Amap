import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    //高德地图显示路由route
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    //多边形编辑器
    path: '/polygon',
    name: 'polygon',
    component: () => import('../views/polygon.vue')
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
