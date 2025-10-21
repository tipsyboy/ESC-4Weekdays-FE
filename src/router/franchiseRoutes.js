import FranchiseList from "@/views/franchise/FranchiseList.vue";
import FranchiseCreate from "@/views/franchise/FranchiseCreate.vue";
import FranchiseDetail from "@/views/franchise/FranchiseDetail.vue";

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
        path: '/franchise/detail',
        name: 'franchiseDetail',
        component: FranchiseDetail,
    },
]

export default franchiseRoutes
