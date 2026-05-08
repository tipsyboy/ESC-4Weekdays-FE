import asnDashboard from '@/views/asn/AsnDashboard.vue'
import asnWorkspace from '@/views/asn/AsnWorkspace.vue'
import asnVendorPortal from '@/views/asn/AsnVendorPortal.vue'
import vendorPurchaseRequestDashboard from '@/views/asn/VendorPurchaseRequestDashboard.vue'
import vendorPurchaseRequestWorkspace from '@/views/asn/VendorPurchaseRequestWorkspace.vue'
import vendorAsnDashboard from '@/views/asn/VendorAsnDashboard.vue'
import vendorAsnWorkspace from '@/views/asn/VendorAsnWorkspace.vue'
import { INTERNAL_ROLES, VENDOR_ONLY } from '@/router/accessRoles.js'

const asnRoutes = [
  {
    path: '/asns',
    name: 'asnDashboard',
    component: asnDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/asns/:id',
    name: 'asnWorkspace',
    component: asnWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/vendor-portal/purchase-requests/:id/asn-reply',
    name: 'asnVendorPortal',
    component: asnVendorPortal,
    props: true,
    meta: { roles: VENDOR_ONLY },
  },
  {
    path: '/vendor-portal/purchase-requests/:id/asn',
    name: 'vendorAsnWorkspace',
    component: vendorAsnWorkspace,
    props: true,
    meta: { roles: VENDOR_ONLY },
  },
  {
    path: '/vendor-portal/purchase-orders',
    name: 'vendorPurchaseRequestDashboard',
    component: vendorPurchaseRequestDashboard,
    meta: { roles: VENDOR_ONLY },
  },
  {
    path: '/vendor-portal/asns',
    name: 'vendorAsnDashboard',
    component: vendorAsnDashboard,
    meta: { roles: VENDOR_ONLY },
  },
  {
    path: '/vendor-portal/purchase-requests/:id',
    name: 'vendorPurchaseRequestWorkspace',
    component: vendorPurchaseRequestWorkspace,
    props: true,
    meta: { roles: VENDOR_ONLY },
  },
  {
    path: '/vendor-purchase-requests',
    redirect: '/vendor-portal/purchase-orders',
  },
  {
    path: '/vendor-purchase-requests/:id/asn-reply',
    redirect: (to) => `/vendor-portal/purchase-requests/${to.params.id}/asn-reply`,
  },
  {
    path: '/vendor-purchase-requests/:id/asn',
    redirect: (to) => `/vendor-portal/purchase-requests/${to.params.id}/asn`,
  },
  {
    path: '/vendor-purchase-requests/:id',
    redirect: (to) => `/vendor-portal/purchase-requests/${to.params.id}`,
  },
  {
    path: '/asn/list',
    redirect: '/asns',
  },
  {
    path: '/asn/vendor',
    redirect: '/vendor-portal/purchase-orders',
  },
  {
    path: '/asn/:id',
    redirect: (to) => `/asns/${to.params.id}`,
  },
]

export default asnRoutes
