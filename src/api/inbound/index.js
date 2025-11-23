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

const getInboundsSearch = async (taskId) => {
  const requestUrl = `/api/tasks/${taskId}`
  return await api
    .get(requestUrl)
    .then((response) => {
      return response.data.results
    })
    .catch((error) => {
      console.error('Task 조회 실패:', error)
      throw error
    })
}

const arriveDelivery = async (inboundId) => {
  return await api
    .patch(`/api/inbounds/${inboundId}/arrive`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response?.data || { success: false, message: '차량 도착 처리 실패' }
    })
}


export default { getInboundList, getInboundDetail, getInboundsSearch, arriveDelivery }
