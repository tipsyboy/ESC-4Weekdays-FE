import api from '@/plugin/axiosInterceptor.js'
import { unwrap, unwrapMessage } from '@/api/common/response.js'

const ok = (results) => ({ success: true, code: 1000, results })
const fail = (message) => ({ success: false, code: 4000, message, results: null })

const getInventories = async (params = {}) => {
  try {
    const { data } = await api.get('/api/inventories', { params })
    return ok(unwrap({ data }))
  } catch (error) {
    return fail(unwrapMessage(error, '재고 목록 조회에 실패했습니다.'))
  }
}

const getInventoryDetail = async (productId) => {
  try {
    const { data } = await api.get(`/api/inventories/${productId}`)
    return ok(unwrap({ data }))
  } catch (error) {
    return fail(unwrapMessage(error, '재고 상세 조회에 실패했습니다.'))
  }
}

const getInventoryMap = async () => {
  try {
    const { data } = await api.get('/api/inventories/map')
    return ok(unwrap({ data }))
  } catch (error) {
    return fail(unwrapMessage(error, '재고 맵 조회에 실패했습니다.'))
  }
}

const getLocations = async () => {
  try {
    const { data } = await api.get('/api/locations')
    return ok(unwrap({ data }))
  } catch (error) {
    return fail(unwrapMessage(error, '위치 목록 조회에 실패했습니다.'))
  }
}

export default {
  getInventories,
  getInventoryDetail,
  getInventoryMap,
  getLocations,
}
