import api from '@/plugin/axiosInterceptor.js'
import { unwrap, unwrapMessage } from '@/api/common/response.js'

const ok = (response, results) => ({
  success: response?.data?.success ?? true,
  code: response?.data?.code ?? 200,
  message: response?.data?.message ?? '',
  results,
})

const fail = (error, fallbackMessage) => ({
  success: false,
  code: error.response?.data?.code || error.response?.status || 500,
  message: unwrapMessage(error, fallbackMessage),
  results: null,
})

const normalizeItem = (item = {}) => ({
  ...item,
  announcedQuantity: Number(item.announcedQuantity),
})

const normalizeAsn = (asn = {}) => ({
  ...asn,
  items: (asn.items || []).map(normalizeItem),
})

const getAsns = async (params = {}) => {
  try {
    const { data } = await api.get('/api/asns', { params })
    const page = unwrap({ data })

    return ok({ data }, {
      ...page,
      content: (page?.content || []).map(normalizeAsn),
    })
  } catch (error) {
    return fail(error, 'ASN 목록 조회에 실패했습니다.')
  }
}

const getAsnDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/asns/${id}`)
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, 'ASN 상세 조회에 실패했습니다.')
  }
}

const getAsnByPurchaseOrderId = async (purchaseOrderId) => {
  try {
    const { data } = await api.get(`/api/asns/purchase-orders/${purchaseOrderId}`)
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, '발주서 기준 ASN 조회에 실패했습니다.')
  }
}

const createAsn = async (req) => {
  try {
    const payload = {
      purchaseOrderId: Number(req.purchaseOrderId),
      expectedArrivalAt: req.expectedArrivalAt,
      status: req.status,
      vehicleInfo: req.vehicleInfo,
      contactName: req.contactName,
      contactPhoneNumber: req.contactPhoneNumber,
      note: req.note,
      items: req.items.map((item) => ({
        productId: Number(item.productId),
        announcedQuantity: Number(item.announcedQuantity),
      })),
    }

    const { data } = await api.post('/api/asns', payload)
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, 'ASN 등록에 실패했습니다.')
  }
}

const updateAsnStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/api/asns/${id}/status`, { status })
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, 'ASN 상태 변경에 실패했습니다.')
  }
}

export default {
  getAsns,
  getAsnDetail,
  getAsnByPurchaseOrderId,
  createAsn,
  updateAsnStatus,
}
