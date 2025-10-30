import VendorAsnPage from '@/views/asn/VendorAsnPage.vue'
import AsnList from '@/views/asn/AsnList.vue'
import AsnDetail from '@/views/asn/AsnDetail.vue'

const asnRoutes = [
  {
    path: '/asn/list',
    name: 'asnList',
    component: AsnList,
  },
  {
    path: '/asn/:id',
    name: 'asnDetail',
    component: AsnDetail,
    props: true,
  },
  {
    path: '/asn/vendor',
    name: 'vendorAsn',
    component: VendorAsnPage,
  },
]

export default asnRoutes
