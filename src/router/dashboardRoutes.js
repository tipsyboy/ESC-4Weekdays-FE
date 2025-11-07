import DashBoardMain from '@/views/dashboard/DashboardMain.vue'

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashBoardMain,
    meta: { roles: ['ADMIN', 'MANAGER'] },
  },
]

export default dashboardRoutes
