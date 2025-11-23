import api from '@/plugin/axiosInterceptor.js'

const locationAvailable = async () => {
  const url = `/api/locations/available`

  return await api
    .get(url)
    .then((res) => {
      console.log(res)
      return res.data
    })
    .catch((error) => {
      return error.data
    })
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
