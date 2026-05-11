import inventoryDashboard from '@/views/inventory/InventoryDashboard.vue'
import inventoryWorkspace from '@/views/inventory/InventoryWorkspace.vue'
import { INTERNAL_ROLES } from '@/router/accessRoles.js'

const inventoryRoutes = [
  {
    path: '/inventories',
    name: 'inventoryDashboard',
    component: inventoryDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/inventories/:id',
    name: 'inventoryWorkspace',
    component: inventoryWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/inventory',
    redirect: '/inventories',
  },
  {
    path: '/inventory/detail/:productCode',
    redirect: '/inventories',
  },
]

export default inventoryRoutes
