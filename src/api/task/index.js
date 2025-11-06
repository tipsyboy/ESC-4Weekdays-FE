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
  let url = `/api/tasks/${taskId}/assign`

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

const taskStart = async (req, taskId) => {
  let data = {}
  let url = `/api/tasks/${taskId}/start`

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

const taskDetail = async (id) => {
  let data = {}
  let url = `/api/tasks/${id}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const inspectionTaskComplete = async (req, taskId) => {
  let data = {}
  let url = `/api/inbound-tasks/inspection/${taskId}/complete`

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

const putawayComplete = async (req, taskId) => {
  let data = {}
  let url = `/api/inbound-tasks/putaway/${taskId}/complete`

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
const putawayStart = async (req, taskId) => {
  let data = {}
  let url = `/api/inbound-tasks/putaway/${taskId}/assign-location`

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

const taskUpdate = async (req, taskId) => {
  let data = {}
  let url = `/api/tasks/${taskId}`

  await api
    .patch(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default {
  taskList,
  taskAssign,
  taskComplete,
  taskCancel,
  taskDetail,
  taskStart,
  inspectionTaskComplete,
  putawayStart,
  putawayComplete,
  taskUpdate,
}
