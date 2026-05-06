import purchaseOrderDashboard from '@/views/purchaseorder/PurchaseOrderDashboard.vue'
import purchaseOrderCreate from '@/views/purchaseorder/PurchaseOrderCreate.vue'
import purchaseOrderWorkspace from '@/views/purchaseorder/PurchaseOrderWorkspace.vue'

const INTERNAL_ROLES = ['ADMIN', 'MANAGER']

const purchaseOrderRoutes = [
  {
    path: '/purchase-orders',
    name: 'purchaseOrderDashboard',
    component: purchaseOrderDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/purchase-orders/create',
    name: 'purchaseOrderCreate',
    component: purchaseOrderCreate,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/purchase-orders/:id',
    name: 'purchaseOrderWorkspace',
    component: purchaseOrderWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/purchase',
    redirect: '/purchase-orders',
  },
  {
    path: '/purchase/create',
    redirect: '/purchase-orders/create',
  },
  {
    path: '/purchase/:id',
    redirect: (to) => `/purchase-orders/${to.params.id}`,
  },
]

export default purchaseOrderRoutes
