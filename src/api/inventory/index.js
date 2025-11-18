import api from '@/plugin/axiosInterceptor'

const getProductInventoryList = async (page, size, request) => {
  const requestUrl = `/api/inventories/search?page=${page}&size=${size}`
  const requestUrlWithEs = `/api/inventories/search/es?page=${page}&size=${size}`

  return await api.post(requestUrlWithEs, request)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response?.data || { success: false, results: {} }
    })
}

const getProductInventoryDetail = async (productCode) => {
  const requestUrl = `/api/inventories/${productCode}`

  return await api.get(requestUrl)
    .then((response) => {
      return response.data.results;
    })
    .catch((err) => {
      return err.response?.data || { success: false, results: {} }
    })
}

export default { getProductInventoryList, getProductInventoryDetail }
