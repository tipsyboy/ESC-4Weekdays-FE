import LoginPage from '@/views/auth/LoginPage.vue'

const loginRoutes = [
  {
    path: '/auth/login',
    name: 'login',
    component: LoginPage,
    meta: {
      guestOnly: true,
    },
  },
]
export default loginRoutes
