import WarehouseList from "@/views/warehouse/WarehouseList.vue";
import WarehouseCreate from "@/views/warehouse/WarehouseCreate.vue";
import WarehouseDetail from "@/views/warehouse/WarehouseDetail.vue";

const warehouseRoutes = [
    {
        path: '/warehouse',
        name: 'warehouseList',
        component: WarehouseList,
    },
    {
        path: '/warehouse/create',
        name: 'warehouseCreate',
        component: WarehouseCreate,
    },
    {
        path: '/warehouse/:id',
        name: 'warehouseDetail',
        component: WarehouseDetail,
    },
    {
        path: '/warehouse/update/:id',
        name: 'warehouseUpdate',
        component: WarehouseDetail,
    },
]

export default warehouseRoutes
