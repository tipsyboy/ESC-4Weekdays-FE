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
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const ui = useUIStore()

  // 로그인 페이지는 인증이 필요하지 않음
  if (to.path === '/auth/login') {
    return next()
  }

  // 인증되지 않은 사용자는 알림 모달을 띄움
  if (!auth.isAuthenticated) {
    ui.openNotificationModal({
      title: '로그인 필요',
      message: '로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.',
      onConfirm: () => next('/auth/login'),
      icon: 'lock',
    })
  } else {
    next()
  }
})

export default router
