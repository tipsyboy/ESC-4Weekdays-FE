import inboundDashboard from '@/views/inbound/InboundDashboard.vue'
import inboundCreateWorkspace from '@/views/inbound/InboundCreateWorkspace.vue'
import inboundWorkspace from '@/views/inbound/InboundWorkspace.vue'
import { INTERNAL_ROLES } from '@/router/accessRoles.js'

const inboundRoutes = [
  {
    path: '/inbounds',
    name: 'inboundDashboard',
    component: inboundDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/inbounds/create',
    name: 'inboundCreateWorkspace',
    component: inboundCreateWorkspace,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/inbounds/:id',
    name: 'inboundWorkspace',
    component: inboundWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/inbound',
    redirect: '/inbounds',
  },
  {
    path: '/inbound/create',
    redirect: '/inbounds/create',
  },
  {
    path: '/inbound/:id',
    redirect: (to) => `/inbounds/${to.params.id}`,
  },
]

export default inboundRoutes
