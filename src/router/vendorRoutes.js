import vendorList from "@/views/vendor/VendorList.vue";
import vendorCreate from "@/views/vendor/VendorCreate.vue";
import vendorDetail from '@/views/vendor/VendorDetail.vue'

const vendorRoutes = [
  {
    path: '/vendors',
    name: 'vendorList',
    component: vendorList,
  },
  {
    path: '/vendors/create',
    name: 'vendorCreate',
    component: vendorCreate,
  },
  {
    path: '/vendors/:id',
    name: 'vendorDetail',
    component: vendorDetail,
    props: true,
  },
]

export default vendorRoutes
