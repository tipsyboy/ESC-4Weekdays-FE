import MemberCreatePage from '@/views/member/MemberCreatePage.vue'
import MemberWorkspace from '@/views/member/MemberWorkspace.vue'
import MemberDashboard from '@/views/member/MemberDashboard.vue'

const memberRoutes = [
  {
    path: '/members',
    name: 'memberDashboard',
    component: MemberDashboard,
    meta: { roles: ['ADMIN'] },
  },
  {
    path: '/members/new',
    name: 'memberCreatePage',
    component: MemberCreatePage,
    meta: { roles: ['ADMIN'] },
  },
  {
    path: '/members/create',
    redirect: '/members/new',
  },
  {
    path: '/members/:id',
    name: 'memberWorkspace',
    component: MemberWorkspace,
    props: true,
    meta: { roles: ['ADMIN'] },
  },
]

export default memberRoutes
