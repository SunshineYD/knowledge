import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/children',
    name: 'Children',
    component: () => import('../views/Children.vue')
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import('../views/Poems.vue')
  },
  {
    path: '/add-poem',
    name: 'AddPoem',
    component: () => import('../views/AddPoem.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router