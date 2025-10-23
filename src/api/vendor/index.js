import api from '@/plugin/axiosInterceptor'

// 공급업체 등록 (Create)
const createVendor = async (req) => {
  let data = {}
  const url = '/api/vendors'

  const body = {
    name: req.name,
    email: req.email,
    phoneNumber: req.phoneNumber,
    description: req.description,
    address: {
      zipcode: req.zipcode,
      street: req.street,
      detail: req.detail,
      city: req.city,
      country: req.country,
    },
  }
  await api
    .post(url, body)
    .then((res) => {
      data = {
        isSuccess: res.data.success,
        code: res.data.code,
        result: res.data.results || {},
      }
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false, result: {} }
    })
  return data
}

// 공급업체 목록 조회
const getVendors = async (params) => {
  let data = {}
  const url = '/api/vendors'
  await api
    .get(url, { params })
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false, result: {} }
    })
  return data
}

// 공급업체 상세 조회
const getVendorDetail = async (id) => {
  let data = {}
  const url = `/api/vendors/${id}`
  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false }
    })
  return data
}

// 공급업체 수정
const updateVendor = async (id, req) => {
  let data = {}
  const url = `/api/vendors/${id}`
  await api
    .patch(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false }
    })
  return data
}

// 공급업체 거래 중단
const suspendVendor = async (id) => {
  let data = {}
  const url = `/api/vendors/${id}`
  await api
    .delete(url)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false }
    })
  return data
}

// 공급업체별 상품 목록 조회
const getVendorProducts = async (vendorId) => {
  let data = {}
  const url = `/api/products?vendorId=${vendorId}`
  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false, result: [] }
    })
  return data
}

// 거래 상태 변경 (활성화 / 중단)
const updateVendorStatus = async (id, status) => {
  let data = {}
  const url = `/api/vendors/${id}/status`
  const body = { status } // ACTIVE 또는 SUSPENDED

  await api
    .patch(url, body)
    .then((res) => {
      data = res.data
    })
    .catch((err) => {
      data = err.response?.data || { isSuccess: false }
    })
  return data
}

export default {
  createVendor,
  getVendors,
  getVendorDetail,
  updateVendor,
  suspendVendor,
  getVendorProducts,
  updateVendorStatus,
}
