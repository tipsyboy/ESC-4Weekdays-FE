import vendorList from "@/views/vendor/VendorList.vue";
import vendorCreate from "@/views/vendor/VendorCreate.vue";
import vendorDetail from '@/views/vendor/VendorDetail.vue'

const vendorRoutes = [
  {
    path: '/vendors',
    name: 'vendorList',
    component: vendorList,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/vendors/create',
    name: 'vendorCreate',
    component: vendorCreate,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/vendors/:id',
    name: 'vendorDetail',
    component: vendorDetail,
    props: true,
    meta: { roles: ['MANAGER'] },
  },
]

export default vendorRoutes
