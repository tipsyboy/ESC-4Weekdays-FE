import vendorDashboard from '@/views/vendor/VendorDashboard.vue'
import vendorCreate from '@/views/vendor/VendorCreate.vue'
import vendorEdit from '@/views/vendor/VendorEdit.vue'
import vendorWorkspace from '@/views/vendor/VendorWorkspace.vue'

const INTERNAL_ROLES = ['ADMIN', 'MANAGER']

const vendorRoutes = [
  {
    path: '/vendors',
    name: 'vendorDashboard',
    component: vendorDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/vendors/create',
    name: 'vendorCreate',
    component: vendorCreate,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/vendors/new',
    redirect: '/vendors/create',
  },
  {
    path: '/vendors/:id/edit',
    name: 'vendorEdit',
    component: vendorEdit,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/vendors/:id',
    name: 'vendorWorkspace',
    component: vendorWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
]

export default vendorRoutes
