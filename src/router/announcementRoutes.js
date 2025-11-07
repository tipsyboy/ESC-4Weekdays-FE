import Announcemnet from '@/views/announcement/Announcemnet.vue'
import AnnouncementCreate from '@/views/announcement/AnnouncementCreate.vue'
import AnnouncementDetail from '@/views/announcement/AnnouncementDetail.vue'
import AnnouncementEdit from '@/views/announcement/AnnouncementEdit.vue'

const announcementRoutes = [
  {
    path: '/announcement',
    name: '공지사항',
    component: Announcemnet,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/announcement/create',
    name: '공지사항 생성',
    component: AnnouncementCreate,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/announcement/:id',
    name: 'announcementDetail',
    component: AnnouncementDetail,
    meta: { roles: ['MANAGER'] },
  },
  {
    path: '/announcement/edit/:id',
    name: 'AnnouncementEdit',
    component: AnnouncementEdit,
    meta: { roles: ['MANAGER'] },
  },
]

export default announcementRoutes
