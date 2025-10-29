import InventoryList from "@/views/inventory/InventoryList.vue";
import InventoryDetail from "@/views/inventory/InventoryDetail.vue";

const inventoryRoutes = [
    {
        path: '/inventory',
        name: 'inventoryList',
        component: InventoryList,
    },
    {
        path: '/inventory/detail/:productCode',
        name: 'inventoryDetail',
        component: InventoryDetail,
    },
]

export default inventoryRoutes
