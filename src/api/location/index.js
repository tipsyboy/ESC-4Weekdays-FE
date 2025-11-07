import api from '@/plugin/axiosInterceptor.js'

const locationAvailable = async (params) => {
  let data = {}
  const url = `/api/locations/available`

  await api
    .get(url, { params })
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
export default { locationAvailable, putawayStart, putawayComplete }
