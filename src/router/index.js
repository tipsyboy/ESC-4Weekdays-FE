import { createRouter, createWebHistory } from 'vue-router'
import purchaseOrderRoutes from '@/router/purchaseOrderRoutes.js'
import ModalTest from '@/views/sandbox/ModalTest.vue'
import inboundRoutes from '@/router/inboundRoutes.js'
import dashboardRoutes from './dashboardRoutes'
import productRoutes from '@/router/productRoutes.js'
import outboundRoutes from '@/router/outboundRoutes.js'
import stockList from '@/router/stockRoutes.js'
import taskRoutes from '@/router/taskRoutes.js'
import employeeRoutes from './employeeRoutes'
import WorkerTaskView from '@/views/task/WorkerTaskView.vue'
import vendorRoutes from '@/router/vendorRoutes.js'
import franchiseRoutes from '@/router/franchiseRoutes.js'
import announcementRoutes from './announcementRoutes'
import warehouseRoutes from '@/router/warehouseRoutes.js'

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
  ...stockList,
  ...productRoutes,
  ...outboundRoutes,
  ...taskRoutes,
  ...employeeRoutes,
  ...vendorRoutes,
  ...franchiseRoutes,
  ...announcementRoutes,
  ...warehouseRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
