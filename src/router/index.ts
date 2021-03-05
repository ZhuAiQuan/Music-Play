import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Main from '../components/Layout/index.vue'
const BASE_URL = import.meta.env.BASE_URL

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/export',
    component: Main,
    children: [
      {
        path: 'export',
        component: () => import('../views/home/index.vue')
      },
      {
        path: 'list',
        component: () => import('../views/list/index.vue')
      },
      {
        path: 'play',
        component: () => import('../views/play/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
})

export default router