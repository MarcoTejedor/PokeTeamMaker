import { createRouter, createWebHashHistory } from 'vue-router'
// Lazy-loaded components for better performance
const HomeView = () => import('../views/HomeView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const TeamsView = () => import('../views/TeamsView.vue')
const TeamDetailView = () => import('../views/TeamDetailView.vue')
const PokemonSlotView = () => import('../views/PokemonSlotView.vue')
const InfoView = () => import('../views/InfoView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false },
  },
  {
    path: '/equipos',
    name: 'Teams',
    component: TeamsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/equipos/:id',
    name: 'TeamDetail',
    component: TeamDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/equipos/:id/slot/:m',
    name: 'PokemonSlot',
    component: PokemonSlotView,
    meta: { requiresAuth: true },
  },
  {
    path: '/info',
    name: 'Info',
    component: InfoView,
    meta: { requiresAuth: false },
  },
  {
    path: '/logout-confirmation',
    name: 'LogoutConfirmation',
    component: () => import('../views/LogoutConfirmationView.vue'),
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation Guard: Auth protection
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userId')
  
  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
    return
  }
  
  // If user is authenticated and trying to access login/register, allow it
  // (they can navigate freely, but App.vue may redirect them)
  next()
})

export default router