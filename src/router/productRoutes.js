import ProductList from '@/views/product/ProductList.vue'
import ProductRegister from '@/views/product/ProductRegister.vue'
import ProductDetail from '@/views/product/ProductDetail.vue'

export default [
  {
    path: '/product',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/product/register',
    name: 'ProductRegister',
    component: ProductRegister,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
]
