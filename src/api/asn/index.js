import api from '@/plugin/axiosInterceptor.js'

// Vendor ASN 수락 전송
const vendorAsnSend = async (req) => {
  let data = {}
  const url = '/api/vendor/asn'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error.data
    })

  return data
}

// Vendor ASN 거절 전송
const vendorAsnReject = async (req) => {
  let data = {}
  const url = '/api/vendor/asn/reject'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error.data
    })

  return data
}

// Vendor 발주 목록 조회 (※ 현재 백엔드에 없으므로 임시 더미 or 주석 처리 가능)
const vendorPurchaseOrderReadAll = async (keyword = '') => {
  let data = {}
  const url = '/api/vendor/purchase-orders'

  await api
    .get(url, { params: { keyword } })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error.data
    })

  return data
}

export default {
  vendorAsnSend,
  vendorAsnReject,
  vendorPurchaseOrderReadAll,
}
