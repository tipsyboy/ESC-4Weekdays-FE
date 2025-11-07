import OrderList from '@/views/order/OrderList.vue'
import OrderDetail from '@/views/order/OrderDetail.vue'

export default [
    {
        path: '/order',
        name: 'OrderList',
        component: OrderList,
        meta: {roles: ['MANAGER']},
    },
    {
        path: '/order/:id',
        name: 'OrderDetail',
        component: OrderDetail,
        meta: {roles: ['MANAGER']},
    },

]
