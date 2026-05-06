import productDashboard from '@/views/product/ProductDashboard.vue'
import productCreate from '@/views/product/ProductCreate.vue'
import productEdit from '@/views/product/ProductEdit.vue'
import productWorkspace from '@/views/product/ProductWorkspace.vue'

const INTERNAL_ROLES = ['ADMIN', 'MANAGER']

const productRoutes = [
  {
    path: '/products',
    name: 'productDashboard',
    component: productDashboard,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/products/create',
    name: 'productCreate',
    component: productCreate,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/products/new',
    redirect: '/products/create',
  },
  {
    path: '/products/:id/edit',
    name: 'productEdit',
    component: productEdit,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/products/:id',
    name: 'productWorkspace',
    component: productWorkspace,
    props: true,
    meta: { roles: INTERNAL_ROLES },
  },
  {
    path: '/product',
    redirect: '/products',
  },
  {
    path: '/product/register',
    redirect: '/products/create',
  },
  {
    path: '/product/:id',
    redirect: (to) => `/products/${to.params.id}`,
  },
]

export default productRoutes
