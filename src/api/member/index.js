import api from '@/plugin/axiosInterceptor.js'

const memberLogin = async (req) => {
  let data = {}
  let url = '/api/login'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const memberLogout = async (req) => {
  let data = {}
  let url = '/api/logout'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const memberList = async (page, size) => {
  let data = {}
  let url = '/api/member/list'

  await api
    .get(url, { params: { page, size } })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const memberEdit = async (id, req) => {
  let data = {}
  let url = `/api/member/${id}`

  await api
    .patch(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const memberCreate = async (req) => {
  let data = {}
  let url = '/api/member/signup'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const memberEmailCheck = async (req) => {
  let data = {}
  let url = '/api/member/check-email'

  await api
    .post(url, req)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}
const memberDetail = async (id) => {
  let data = {}
  let url = `/api/member/${id}`

  await api
    .get(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const MemberSearch = async (page, size, searchParams = {}) => {
  let data = {}
  const url = '/api/member/search'

  const params = {
    page,
    size,
    name: searchParams.name || '',
    role: searchParams.role || '',
    status: searchParams.status || '',
    fromDate: searchParams.fromDate || '',
    toDate: searchParams.toDate || '',
  }

  await api
    .get(url, { params })
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.response?.data || error
    })

  return data
}

export default {
  memberLogin,
  memberLogout,
  memberList,
  memberEdit,
  memberCreate,
  memberEmailCheck,
  memberDetail,
  MemberSearch,
}
