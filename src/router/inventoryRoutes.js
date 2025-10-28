import InventoryList from "@/views/inventory/InventoryList.vue";
import InventoryDetail from "@/views/inventory/InventoryDetail.vue";

const stockList = [
    {
        path: '/2',
        name: 'inventoryList',
        component: InventoryList,
    },
    {
        path: '/inventory/detail',
        name: 'inventoryDetail',
        component: InventoryDetail,
    },
]

export default stockList
