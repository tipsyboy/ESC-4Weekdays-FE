import vendorList from "@/views/vendor/VendorList.vue";
import vendorCreate from "@/views/vendor/VendorCreate.vue";
import vendorDetail from '@/views/vendor/VendorDetail.vue'

const vendorRoutes = [
  {
    path: '/vendor',
    name: 'vendorList',
    component: vendorList,
  },
  {
    path: '/vendor/create',
    name: 'vendorCreate',
    component: vendorCreate,
  },
  {
    path: '/vendor/:id',
    name: 'vendorDetail',
    component: vendorDetail,
    props: true,
  },
]

export default vendorRoutes
