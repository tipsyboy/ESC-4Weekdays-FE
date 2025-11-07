import FranchiseList from "@/views/franchise/FranchiseList.vue";
import FranchiseCreate from "@/views/franchise/FranchiseCreate.vue";
import FranchiseDetail from "@/views/franchise/FranchiseDetail.vue";
import FranchiseUpdate from "@/views/franchise/FranchiseUpdate.vue";

const franchiseRoutes = [
    {
        path: '/franchise',
        name: 'franchiseList',
        component: FranchiseList,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/franchise/create',
        name: 'franchiseCreate',
        component: FranchiseCreate,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/franchise/:id',
        name: 'franchiseDetail',
        component: FranchiseDetail,
        meta: { roles: ['MANAGER'] },
    },
    {
        path: '/franchise/edit/:id',
        name: 'franchiseUpdate',
        component: FranchiseUpdate,
        meta: { roles: ['MANAGER'] },
    },
]

export default franchiseRoutes
