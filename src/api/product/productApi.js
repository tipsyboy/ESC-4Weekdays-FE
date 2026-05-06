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

const createProduct = async (req) => {
  try {
    const payload = {
      vendorId: Number(req.vendorId),
      name: req.name,
      category: req.category,
      unitPrice: Number(req.unitPrice),
      boxQuantity: Number(req.boxQuantity),
      stockQuantity: Number(req.stockQuantity),
      safetyStock: Number(req.safetyStock),
      leadTimeDays: Number(req.leadTimeDays),
      status: req.status,
      description: req.description,
    }

    const { data } = await api.post('/api/products', payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '상품 등록에 실패했습니다.')
  }
}

const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get('/api/products', { params })
    return ok({ data })
  } catch (error) {
    return fail(error, '상품 목록 조회에 실패했습니다.')
  }
}

const getProductDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/products/${id}`)
    return ok({ data })
  } catch (error) {
    return fail(error, '상품 상세 조회에 실패했습니다.')
  }
}

const updateProduct = async (id, req) => {
  try {
    const payload = {
      vendorId: Number(req.vendorId),
      name: req.name,
      category: req.category,
      unitPrice: Number(req.unitPrice),
      boxQuantity: Number(req.boxQuantity),
      stockQuantity: Number(req.stockQuantity),
      safetyStock: Number(req.safetyStock),
      leadTimeDays: Number(req.leadTimeDays),
      status: req.status,
      description: req.description,
    }

    const { data } = await api.patch(`/api/products/${id}`, payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '상품 수정에 실패했습니다.')
  }
}

const updateProductStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/api/products/${id}/status`, { status })
    return ok({ data })
  } catch (error) {
    return fail(error, '상품 상태 변경에 실패했습니다.')
  }
}

export default {
  createProduct,
  getProducts,
  getProductDetail,
  updateProduct,
  updateProductStatus,
}
