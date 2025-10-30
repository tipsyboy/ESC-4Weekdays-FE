import api from '@/plugin/axiosInterceptor.js'

// ASN 목록 조회
const getAsnList = async (page = 0, size = 10) => {
  let data = {}
  const url = '/api/admin/asn'

  await api
    .get(url, { params: { page, size } })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error.data
    })

  return data
}

// ASN 상세 조회
const getAsnDetail = async (id) => {
  let data = {}
  const url = `/api/admin/asn/${id}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error.data
    })

  return data
}

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

export default {
  getAsnList,
  getAsnDetail,
  vendorAsnSend,
  vendorAsnReject,
}
