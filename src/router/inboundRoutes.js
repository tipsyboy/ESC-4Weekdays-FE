import InboundList from '@/views/inbound/InboundList.vue'
import InboundCreate from '@/views/inbound/InboundCreate.vue'
import InboundDetail from '@/views/inbound/InboundDetail.vue'

const inboundRoutes = [
  {
    path: '/inbound',
    name: 'inboundList',
    component: InboundList,
  },
  {
    path: '/inbound/create',
    name: 'inboundCreate',
    component: InboundCreate,
  },
  {
    path: '/inbound/:id',
    name: 'inboundDetail',
    component: InboundDetail,
    props: true,
  },
]

export default inboundRoutes
