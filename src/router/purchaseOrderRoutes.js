import PurchaseOrderList from '@/views/purchase/PurchaseOrderList.vue'
import PurchaseOrderCreate from '@/views/purchase/PurchaseOrderCreate.vue'
import PurchaseOrderDetail from '@/views/purchase/PurchaseOrderDetail.vue'

const purchaseOrderRoutes = [
  {
    path: '/purchase',
    name: 'purchaseOrder',
    component: PurchaseOrderList,
  },
  {
    path: '/purchase/create',
    name: 'purchaseOrderCreate',
    component: PurchaseOrderCreate,
  },
  {
    path: '/purchase/:id',
    name: 'purchaseOrderDetail',
    component: PurchaseOrderDetail,
  },
]

export default purchaseOrderRoutes
