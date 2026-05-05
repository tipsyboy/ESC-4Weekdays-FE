import api from '@/plugin/axiosInterceptor.js'
import { unwrap, unwrapMessage } from '@/api/common/response.js'

const ok = (response, fallbackResults = null) => ({
  success: response?.data?.success ?? true,
  code: response?.data?.code ?? 200,
  message: response?.data?.message ?? '',
  results: unwrap(response) ?? fallbackResults,
})

const fail = (error, fallbackMessage) => ({
  success: false,
  code: error.response?.data?.code || error.response?.status || 500,
  message: unwrapMessage(error, fallbackMessage),
  results: null,
})

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
    const { data } = await api.get(`/api/vendors/${id}/products`)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 상품 조회에 실패했습니다.')
  }
}

const getVendorPurchaseOrders = async (id, params = {}) => {
  try {
    const { data } = await api.get(`/api/vendors/${id}/purchase-orders`, { params })
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 발주 조회에 실패했습니다.')
  }
}

const getVendorAsns = async (id) => {
  try {
    const { data } = await api.get(`/api/vendors/${id}/asns`)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 ASN 조회에 실패했습니다.')
  }
}

const getVendorInbounds = async (id) => {
  try {
    const { data } = await api.get(`/api/vendors/${id}/inbounds`)
    return ok({ data })
  } catch (error) {
    return fail(error, '공급업체 입고 조회에 실패했습니다.')
  }
}

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
