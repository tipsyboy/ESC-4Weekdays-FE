import api from '@/plugin/axiosInterceptor'

const getInboundList = async (searchRequest, page = 0, size = 10) => {

  const requestUrl = `/api/inbounds/search?page=${page}&size=${size}`

  return await api
    .post(requestUrl, searchRequest)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || { success: false, results: {} }
    })
}

const getInboundDetail = async (inboundId) => {
  return await api
    .get(`/api/inbounds/${inboundId}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || { success: false, results: {} }
    })
}

export default { getInboundList, getInboundDetail }
