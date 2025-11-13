import { createRouter, createWebHistory } from 'vue-router'
import purchaseOrderRoutes from '@/router/purchaseOrderRoutes.js'
import ModalTest from '@/views/sandbox/ModalTest.vue'
import inboundRoutes from '@/router/inboundRoutes.js'
import dashboardRoutes from './dashboardRoutes'
import productRoutes from '@/router/productRoutes.js'
import outboundRoutes from '@/router/outboundRoutes.js'
import inventoryRoutes from '@/router/inventoryRoutes.js'
import taskRoutes from '@/router/taskRoutes.js'
import employeeRoutes from './employeeRoutes'
import vendorRoutes from '@/router/vendorRoutes.js'
import franchiseRoutes from '@/router/franchiseRoutes.js'
import announcementRoutes from './announcementRoutes'
import warehouseRoutes from '@/router/warehouseRoutes.js'
import TaskKanban from '@/views/task/TaskKanban.vue'
import loginRoutes from './loginRouter'
import { useAuthStore } from '@/stores/authStore.js'
import { useUIStore } from '@/stores/uiStore.js'
import asn from '@/api/asn'
import asnRoutes from './asnRoutes'
import orderRoutes from "@/router/orderRoutes.js";

const routes = [
  { path: '/', redirect: '/auth/login' },
  {
    path: '/modaltest',
    component: ModalTest,
  },
  {
    path: '/test',
    component: ModalTest,
  },

  ...purchaseOrderRoutes,
  ...inboundRoutes,
  ...dashboardRoutes,
  ...inventoryRoutes,
  ...productRoutes,
  ...outboundRoutes,
  ...taskRoutes,
  ...employeeRoutes,
  ...vendorRoutes,
  ...franchiseRoutes,
  ...announcementRoutes,
  ...warehouseRoutes,
  ...loginRoutes,
  ...asnRoutes,
  ...orderRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = auth.isAuthenticated
  const userRole = auth.role
  const requiredRoles = to.meta.roles

  // 🔹 로그인 안 된 경우
  if (!isAuthenticated) {
    if (to.path === '/auth/login') {
      return next()
    } else {
      return next('/auth/login')
    }
  }

  // 🔹 로그인된 상태에서 로그인 페이지 접근 시
  if (to.path === '/auth/login') {
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      return next('/dashboard')
    } else if (userRole === 'WORKER') {
      return next('/task/Worker/view')
    } else {
      return next('/dashboard')
    }
  }

  // 🔹 권한이 필요한 페이지일 경우
  if (requiredRoles && requiredRoles.length > 0) {
    // ADMIN은 모든 페이지 접근 가능
    if (userRole === 'ADMIN') {
      return next()
    }

    // 해당 페이지 접근 가능한 역할이면 통과
    if (requiredRoles.includes(userRole)) {
      return next()
    } else {
      alert('이 페이지에 접근할 권한이 없습니다.')
      return next(from.path)
    }
  }

  // 🔹 권한 정보가 없는 페이지는 누구나 접근 가능
  return next()
})

export default router
