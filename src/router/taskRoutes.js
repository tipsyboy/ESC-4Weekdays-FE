export default [
  {
    path: '/task/list',
    name: 'TaskList',
    component: () => import('@/views/task/TaskList.vue'),
  },
  {
    path: '/task/detail/:id',
    name: 'TaskDetail',
    component: () => import('@/views/task/TaskDetail.vue'),
  },
  {
    path: '/task/Worker/view',
    name: 'TaskDetail',
    component: () => import('@/views/task/WorkerTaskView.vue'),
  },
  {
    path: '/task/Kanban',
    name: 'TaskKanban',
    component: () => import('@/views/task/TaskKanban.vue'),
  },
]
