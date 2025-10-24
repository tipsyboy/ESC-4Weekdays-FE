import Announcemnet from '@/views/announcement/Announcemnet.vue'
import AnnouncementCreate from '@/views/announcement/AnnouncementCreate.vue'
import AnnouncementDetail from '@/views/announcement/AnnouncementDetail.vue'
import AnnouncementEdit from '@/views/announcement/AnnouncementEdit.vue'

const announcementRoutes = [
  {
    path: '/announcement',
    name: '공지사항',
    component: Announcemnet,
  },
  {
    path: '/announcement/create',
    name: '공지사항 생성',
    component: AnnouncementCreate,
  },
  {
    path: '/announcement/:id',
    name: 'announcementDetail',
    component: AnnouncementDetail,
  },
  {
    path: '/announcement/edit/:id',
    name: 'AnnouncementEdit',
    component: AnnouncementEdit,
  },
]

export default announcementRoutes
