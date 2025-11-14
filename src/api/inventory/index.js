import api from '@/plugin/axiosInterceptor'

const getProductInventoryList = async (page, size, request) => {
  const requestUrl = `/api/inventories?page=${page}&size=${size}`

  return await api
    .post(requestUrl, request)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      return err.response?.data || { success: false, results: {} }
    })
}

const getProductInventoryDetail = async (productCode) => {
  const requestUrl = `/api/inventories/${productCode}`

  return await api
    .get(requestUrl)
    .then((response) => {
      return response.data.results
    })
    .catch((err) => {
      return err.response?.data || { success: false, results: {} }
    })
}

export default { getProductInventoryList, getProductInventoryDetail }
