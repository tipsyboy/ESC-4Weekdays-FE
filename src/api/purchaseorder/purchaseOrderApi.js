import api from '@/plugin/axiosInterceptor.js'
import { unwrap, unwrapMessage } from '@/api/common/response.js'
import vendorApi from '@/api/vendor/vendorApi.js'
import productApi from '@/api/product/productApi.js'

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

const normalizePurchaseOrder = (purchaseOrder) => ({
  ...purchaseOrder,
  items: (purchaseOrder.items || []).map((item) => ({
    ...item,
    quantity: item.quantity ?? item.orderQuantity,
    unitPrice: item.unitPrice ?? item.orderUnitPrice,
  })),
})

const createPurchaseOrder = async (req) => {
  try {
    const payload = {
      vendorId: Number(req.vendorId),
      requesterName: req.requesterName,
      expectedInboundDate: req.expectedInboundDate || null,
      requestMemo: req.requestMemo,
      status: req.submitType === 'REQUEST' ? 'APPROVAL_PENDING' : 'DRAFT',
      items: req.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    }

    const { data } = await api.post('/api/purchase-orders', payload)
    return ok({ data }, normalizePurchaseOrder(unwrap({ data })))
  } catch (error) {
    return fail(error, '발주 등록에 실패했습니다.')
  }
}

const getPurchaseOrders = async (params = {}) => {
  try {
    const { data } = await api.get('/api/purchase-orders', { params })
    const page = unwrap({ data })

    return ok({ data }, {
      ...page,
      content: (page?.content || []).map(normalizePurchaseOrder),
    })
  } catch (error) {
    return fail(error, '발주 목록 조회에 실패했습니다.')
  }
}

const getPurchaseOrderDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/purchase-orders/${id}`)
    return ok({ data }, normalizePurchaseOrder(unwrap({ data })))
  } catch (error) {
    return fail(error, '발주 상세 조회에 실패했습니다.')
  }
}

const updatePurchaseOrderStatus = async (id, status) => {
  try {
    const payload = { status }

    if (status === 'APPROVED') {
      payload.approverName = '운영관리자'
    }

    const { data } = await api.patch(`/api/purchase-orders/${id}/status`, payload)
    return ok({ data }, normalizePurchaseOrder(unwrap({ data })))
  } catch (error) {
    return fail(error, '발주 상태 변경에 실패했습니다.')
  }
}

const getPurchaseOrderFormMeta = async () => {
  try {
    const [vendorRes, productRes] = await Promise.all([
      vendorApi.getVendors({ page: 0, size: 1000, sortBy: 'name', sortDirection: 'asc' }),
      productApi.getProducts({ page: 0, size: 1000, sortBy: 'name', sortDirection: 'asc' }),
    ])

    if (!vendorRes.success) {
      return {
        success: false,
        code: vendorRes.code || 500,
        message: vendorRes.message || '공급업체 목록 조회에 실패했습니다.',
        results: null,
      }
    }

    if (!productRes.success) {
      return {
        success: false,
        code: productRes.code || 500,
        message: productRes.message || '상품 목록 조회에 실패했습니다.',
        results: null,
      }
    }

    const vendors = vendorRes.results?.content || []
    const productCatalog = (productRes.results?.content || []).reduce((acc, product) => {
      const vendorId = String(product.vendorId)
      if (!acc[vendorId]) {
        acc[vendorId] = []
      }

      acc[vendorId].push({
        productId: product.id,
        productCode: product.productCode,
        productName: product.name,
        unitPrice: product.unitPrice,
        stockQuantity: product.stockQuantity,
      })

      return acc
    }, {})

    return ok({ data: { success: true, code: 200, message: '' } }, {
      vendors,
      productCatalog,
    })
  } catch (error) {
    return fail(error, '발주 메타 정보 조회에 실패했습니다.')
  }
}

export default {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderDetail,
  updatePurchaseOrderStatus,
  getPurchaseOrderFormMeta,
}
