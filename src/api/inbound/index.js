import api from '@/plugin/axiosInterceptor'

const getInboundList = async (params) => {
  let data = {}
  const url = '/api/inbounds'

  await api
    .get(url, { params })
    .then((res) => {
      data = res.data // 백엔드의 { success, code, message, results } 그대로 반환
    })
    .catch((err) => {
      data = err.response?.data || { success: false, results: {} }
    })

  return data
}

const getInboundDetail = async (inboundId) => {
  let data = {}
  const url = `/api/inbounds/${inboundId}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { success: false, results: {} }
    })

  return data
}

export default {
  getInboundList,
  getInboundDetail,
}
