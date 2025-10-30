import api from '@/plugin/axiosInterceptor.js'

const taskList = async (page, size) => {
  let data = {}
  let url = '/api/tasks/list'

  await api
    .get(url, { params: { page, size } })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const taskAssign = async (req, taskId) => {
  let data = {}
  let url = `/api/tasks/${taskId}/assing`

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const taskComplete = async (req, taskId) => {
  let data = {}
  let url = `/api/tasks/${taskId}/complete`

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const taskCancel = async (req, taskId) => {
  let data = {}
  let url = `/api/tasks/${taskId}/cancel`

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default { taskList, taskAssign, taskComplete, taskCancel }
