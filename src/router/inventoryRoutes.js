import InventoryList from "@/views/inventory/InventoryList.vue";
import InventoryDetail from "@/views/inventory/InventoryDetail.vue";

const inventoryRoutes = [
    {
        path: '/inventory',
        name: 'inventoryList',
        component: InventoryList,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/inventory/detail/:productCode',
        name: 'inventoryDetail',
        component: InventoryDetail,
        meta: { roles: ['MANAGER'] },
    },
]

export default inventoryRoutes
