import api from '@/plugin/axiosInterceptor.js'
import { fail, ok } from '@/api/common/response.js'

const createVendor = async (payload) => {
  try {
    const { data } = await api.post('/api/vendors', payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 등록에 실패했습니다.')
  }
}

const getVendors = async (params = {}) => {
  try {
    const { data } = await api.get('/api/vendors', { params })
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 목록 조회에 실패했습니다.')
  }
}

const getVendorDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/vendors/${id}`)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 상세 조회에 실패했습니다.')
  }
}

const updateVendor = async (id, payload) => {
  try {
    const { data } = await api.patch(`/api/vendors/${id}`, payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 수정에 실패했습니다.')
  }
}

const updateVendorStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/api/vendors/${id}/status`, { status })
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 상태 변경에 실패했습니다.')
  }
}

const getVendorProducts = async (id) => {
  try {
    const { data } = await api.get(`/api/products`, { params: { vendorId: id } })
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 상품 조회에 실패했습니다.')
  }
}

const notConnected = async (message) => ({
  success: true,
  code: 200,
  message: '',
  results: { content: [], totalPages: 0, totalElements: 0, message },
})

const getVendorPurchaseOrders = async () => notConnected('발주 연결은 후속 작업에서 진행합니다.')
const getVendorAsns = async () => notConnected('ASN 연결은 후속 작업에서 진행합니다.')
const getVendorInbounds = async () => notConnected('입고 연결은 후속 작업에서 진행합니다.')

export default {
  createVendor,
  getVendors,
  getVendorDetail,
  updateVendor,
  updateVendorStatus,
  getVendorProducts,
  getVendorPurchaseOrders,
  getVendorAsns,
  getVendorInbounds,
}
