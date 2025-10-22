import FranchiseList from "@/views/franchise/FranchiseList.vue";
import FranchiseCreate from "@/views/franchise/FranchiseCreate.vue";
import FranchiseDetail from "@/views/franchise/FranchiseDetail.vue";
import FranchiseUpdate from "@/views/franchise/FranchiseUpdate.vue";

const franchiseRoutes = [
    {
        path: '/franchise',
        name: 'franchiseList',
        component: FranchiseList,
    },
    {
        path: '/franchise/create',
        name: 'franchiseCreate',
        component: FranchiseCreate,
    },
    {
        path: '/franchise/:id',
        name: 'franchiseDetail',
        component: FranchiseDetail,
    },
    {
        path: '/franchise/edit/:id',
        name: 'franchiseUpdate',
        component: FranchiseUpdate,
    },
]

export default franchiseRoutes
