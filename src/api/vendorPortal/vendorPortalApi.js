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

const normalizePurchaseOrder = (purchaseOrder = {}) => ({
  ...purchaseOrder,
  items: (purchaseOrder.items || []).map((item) => ({
    ...item,
    quantity: item.quantity ?? item.orderQuantity,
    unitPrice: item.unitPrice ?? item.orderUnitPrice,
  })),
})

const normalizeAsnItem = (item = {}) => ({
  ...item,
  announcedQuantity: Number(item.announcedQuantity),
})

const normalizeAsn = (asn = {}) => ({
  ...asn,
  items: (asn.items || []).map(normalizeAsnItem),
})

const getPurchaseOrders = async (params = {}) => {
  try {
    const { data } = await api.get('/api/vendor-portal/purchase-orders', { params })
    const page = unwrap({ data })

    return ok({ data }, {
      ...page,
      content: (page?.content || []).map(normalizePurchaseOrder),
    })
  } catch (error) {
    return fail(error, '공급업체 발주 요청 목록 조회에 실패했습니다.')
  }
}

const getPurchaseOrderDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/vendor-portal/purchase-orders/${id}`)
    return ok({ data }, normalizePurchaseOrder(unwrap({ data })))
  } catch (error) {
    return fail(error, '공급업체 발주 요청 상세 조회에 실패했습니다.')
  }
}

const getAsnByPurchaseOrderId = async (purchaseOrderId) => {
  try {
    const { data } = await api.get(`/api/vendor-portal/purchase-orders/${purchaseOrderId}/asn`)
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, '공급업체 발주 요청 ASN 조회에 실패했습니다.')
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

    const { data } = await api.post('/api/vendor-portal/asns', payload)
    return ok({ data }, normalizeAsn(unwrap({ data })))
  } catch (error) {
    return fail(error, '공급업체 ASN 회신 저장에 실패했습니다.')
  }
}

export default {
  getPurchaseOrders,
  getPurchaseOrderDetail,
  getAsnByPurchaseOrderId,
  createAsn,
}
