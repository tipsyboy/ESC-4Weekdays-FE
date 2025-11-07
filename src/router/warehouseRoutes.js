import WarehouseList from "@/views/warehouse/WarehouseList.vue";
import WarehouseCreate from "@/views/warehouse/WarehouseCreate.vue";
import WarehouseDetail from "@/views/warehouse/WarehouseDetail.vue";

const warehouseRoutes = [
    {
        path: '/warehouse',
        name: 'warehouseList',
        component: WarehouseList,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/warehouse/create',
        name: 'warehouseCreate',
        component: WarehouseCreate,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/warehouse/:id',
        name: 'warehouseDetail',
        component: WarehouseDetail,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/warehouse/update/:id',
        name: 'warehouseUpdate',
        component: WarehouseDetail,
        meta: { roles: ['MANAGER'] },
    },
]

export default warehouseRoutes
