import api from '@/plugin/axiosInterceptor'

// 발주 목록 조회
const getPurchaseOrders = async (params) => {
  let data = {}
  const url = '/api/purchase-orders'
  await api
    .get(url, { params })
    .then((res) => (data = res.data))
    .catch((err) => (data = err.response.data))
  return data
}

// 발주 상세 조회
const getPurchaseOrderDetail = async (id) => {
  let data = {}
  const url = `/api/purchase-orders/${id}`
  await api
    .get(url)
    .then((res) => (data = res.data))
    .catch((err) => (data = err.response.data))
  return data
}

// 발주 등록
const addPurchaseOrder = async (req) => {
  let data = {}
  const url = '/api/purchase-orders'
  await api
    .post(url, req)
    .then((res) => {
      data = {
        isSuccess: res.data.success,
        code: res.data.code,
        result: res.data.results
      }
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false, result: null }
    })
  return data
}


// 발주 수정
const updatePurchaseOrder = async (id, req) => {
  let data = {}
  const url = `/api/purchase-orders/${id}`
  await api
    .patch(url, req)
    .then((res) => (data = res.data))
    .catch((err) => (data = err.response.data))
  return data
}

// 발주 승인
const approvePurchaseOrder = async (id) => {
  let data = {}
  const url = `/api/purchase-orders/${id}/approve`
  await api
    .post(url)
    .then((res) => (data = res.data))
    .catch((err) => (data = err.response.data))
  return data
}

// 발주 취소
const cancelPurchaseOrder = async (id) => {
  let data = {}
  const url = `/api/purchase-orders/${id}`
  await api
    .delete(url)
    .then((res) => (data = res.data))
    .catch((err) => (data = err.response.data))
  return data
}

// 공급업체 목록 조회
const getVendors = async () => {
  let data = {}
  const url = '/api/vendors'
  await api
    .get(url)
    .then((res) => {
      data = {
        isSuccess: res.data.success,
        code: res.data.code,
        result: res.data.results?.content || [],
      }
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false, result: [] }
    })
  return data
}


// 선택된 공급업체의 상품 목록 조회
const getVendorProducts = async (vendorId) => {
  const requestUrl = `/api/products?vendorId=${vendorId}`
  return await api
    .get(requestUrl)
    .then((response) => {
      return response.data.results;
    })
    .catch((err) => {
      throw err;
    })
}
export default {
  getPurchaseOrders,
  getPurchaseOrderDetail,
  addPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  cancelPurchaseOrder,
  getVendors,
  getVendorProducts
}