import PurchaseOrderList from '@/views/purchase/PurchaseOrderList.vue'
import PurchaseOrderCreate from '@/views/purchase/PurchaseOrderCreate.vue'
import PurchaseOrderDetail from '@/views/purchase/PurchaseOrderDetail.vue'

const purchaseOrderRoutes = [
  {
    path: '/purchase',
    name: 'purchaseOrder',
    component: PurchaseOrderList,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/purchase/create',
    name: 'purchaseOrderCreate',
    component: PurchaseOrderCreate,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/purchase/:id',
    name: 'purchaseOrderDetail',
    component: PurchaseOrderDetail,
    meta: { roles: ['MANAGER'] },
  },
]

export default purchaseOrderRoutes
