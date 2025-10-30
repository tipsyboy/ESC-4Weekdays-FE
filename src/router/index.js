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
import asnRoutes from '@/router/asnRoutes.js'

const routes = [
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
  ...asnRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
