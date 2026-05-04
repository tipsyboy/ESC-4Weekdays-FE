import { createRouter, createWebHistory } from 'vue-router'
import purchaseOrderRoutes from '@/router/purchaseOrderRoutes.js'
import ModalTest from '@/views/sandbox/ModalTest.vue'
import inboundRoutes from '@/router/inboundRoutes.js'
import dashboardRoutes from './dashboardRoutes'
import productRoutes from '@/router/productRoutes.js'
import outboundRoutes from '@/router/outboundRoutes.js'
import inventoryRoutes from '@/router/inventoryRoutes.js'
import taskRoutes from '@/router/taskRoutes.js'
import memberRoutes from './memberRoutes'
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
import pinia from '@/stores'

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
  ...memberRoutes,
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

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia)
  await auth.initialize()

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return auth.defaultRoute()
  }

  if (!to.meta.guestOnly && !auth.isAuthenticated) {
    return '/auth/login'
  }

  const requiredRoles = to.meta.roles || []
  if (requiredRoles.length && !auth.hasAnyRole(requiredRoles)) {
    return auth.defaultRoute()
  }

  return true
})

export default router
