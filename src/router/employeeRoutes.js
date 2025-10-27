import EmployeeCreate from '@/views/employee/EmployeeCreate.vue'
import EmployeeDetail from '@/views/employee/EmployeeDetail.vue'
import EmployeeManegment from '@/views/employee/EmployeeManegment.vue'

const employeeRoutes = [
  {
    path: '/employee',
    name: 'employee',
    component: EmployeeManegment,
  },
  {
    path: '/employee/create',
    name: 'employeeCreate',
    component: EmployeeCreate,
  },
  {
    path: '/employee/:id',
    name: 'employeeId',
    component: EmployeeDetail,
  },
]

export default employeeRoutes
