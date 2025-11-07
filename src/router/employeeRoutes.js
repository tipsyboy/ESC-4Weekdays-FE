import EmployeeCreate from '@/views/employee/EmployeeCreate.vue'
import EmployeeDetail from '@/views/employee/EmployeeDetail.vue'
import EmployeeManegment from '@/views/employee/EmployeeManegment.vue'

const employeeRoutes = [
  {
    path: '/employee',
    name: 'employee',
    component: EmployeeManegment,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/employee/create',
    name: 'employeeCreate',
    component: EmployeeCreate,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/employee/:id',
    name: 'employeeId',
    component: EmployeeDetail,
    meta: { roles: ['MANAGER'] },
  },
]

export default employeeRoutes
