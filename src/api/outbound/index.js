import api from '@/plugin/axiosInterceptor.js'

const outboundCreate = async (req) => {
  let data = {}
  let url = '/api/outbounds'

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

const outboundRead = async (page = 0, size = 10) => {
  let data = {}
  let url = '/api/outbounds'

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

const outboundDetail = async (id) => {
  let data = {}
  let url = `/api/outbounds/${id}`

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

const outboundApprove = async (id) => {
  let data = {}
  let url = `/api/outbounds/${id}/approve`

  await api
    .patch(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const outboundCancelled = async (id) => {
  let data = {}
  let url = `/api/outbounds/${id}/cancelled`

  await api
    .patch(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default {
  outboundCreate,
  outboundRead,
  outboundDetail,
  outboundApprove,
  outboundCancelled,
}
