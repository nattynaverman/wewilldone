import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    }
  ]
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  
  console.log('Route guard:', { to: to.name, isAuthenticated, token: !!token })
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login - no auth')
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Redirecting to home - already authenticated')
    next({ name: 'home' })
  } else {
    console.log('Allowing navigation')
    next()
  }
})

export default router