export default [
  {
    path: '/task/list',
    name: 'TaskList',
    component: () => import('@/views/task/TaskList.vue'),
    meta: { roles: ['MANAGER', 'WORKER'] },
  },
  {
    path: '/task/detail/:id',
    name: 'TaskDetail',
    component: () => import('@/views/task/TaskDetail.vue'),
    meta: { roles: ['MANAGER', 'WORKER'] },
  },
  {
    path: '/task/Worker/view',
    name: 'TaskWorkerView',
    component: () => import('@/views/task/WorkerTaskView.vue'),
    meta: { roles: ['MANAGER', 'WORKER'] },
  },
  {
    path: '/task/Kanban',
    name: 'TaskKanban',
    component: () => import('@/views/task/TaskKanban.vue'),
    meta: { roles: ['MANAGER', 'WORKER'] },
  },
]
