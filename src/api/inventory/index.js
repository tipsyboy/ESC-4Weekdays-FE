import api from '@/plugin/axiosInterceptor'

const getInventoryListByPaging = async (page, size, request) => {
  let data = {}
  const url = `/api/inventories?page=${page}&size=${size}`

  await api.post(url, request)
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      data = err.response?.data || { success: false, results: {} }
    })

  return data
}

export default { getInventoryListByPaging }
