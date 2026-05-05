import api from '@/plugin/axiosInterceptor.js'

const normalizeError = (error, fallbackMessage) => {
  const data = error.response?.data
  return {
    success: false,
    code: data?.code || error.response?.status || 4000,
    message: data?.message || fallbackMessage,
    results: null,
  }
}

const ok = (results, data) => ({
  success: data?.success ?? true,
  code: data?.code ?? 20000,
  message: data?.message ?? '',
  results,
})

const memberList = async (page = 0, size = 20) => {
  try {
    const { data } = await api.get('/api/members', { params: { page, size } })
    return ok(data?.results ?? { content: [], totalPages: 0, totalElements: 0, size, number: page }, data)
  } catch (error) {
    return normalizeError(error, '직원 목록 조회에 실패했습니다.')
  }
}

const getMembers = async () => memberList(0, 200)

const memberDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/members/${id}`)
    return ok(data?.results ?? null, data)
  } catch (error) {
    return normalizeError(error, '직원 상세 조회에 실패했습니다.')
  }
}

const getMemberDetail = async (id) => memberDetail(id)

const memberCreate = async (payload) => {
  try {
    const { data } = await api.post('/api/members', payload)
    return ok(data?.results ?? null, data)
  } catch (error) {
    return normalizeError(error, '직원 등록에 실패했습니다.')
  }
}

const createMember = async (payload) => {
  const request = {
    ...payload,
    password: payload.password || 'qwer1234',
  }
  return memberCreate(request)
}

const memberEdit = async (id, payload) => {
  try {
    const { data } = await api.patch(`/api/members/${id}`, payload)
    return ok(data?.results ?? null, data)
  } catch (error) {
    return normalizeError(error, '직원 수정에 실패했습니다.')
  }
}

const updateMember = async (id, payload) => memberEdit(id, payload)

const updateMemberStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/api/members/${id}/status`, { status })
    return ok(data?.results ?? null, data)
  } catch (error) {
    return normalizeError(error, '직원 상태 변경에 실패했습니다.')
  }
}

const memberEmailCheck = async (payload) => {
  try {
    const { data } = await api.post('/api/members/check-email', payload)
    return ok(data?.results ?? data?.message ?? null, data)
  } catch (error) {
    return normalizeError(error, '이메일 중복 확인에 실패했습니다.')
  }
}

const MemberSearch = async (page = 0, size = 20, searchParams = {}) => {
  try {
    const { data } = await api.get('/api/members/search', {
      params: {
        page,
        size,
        name: searchParams.name || '',
        role: searchParams.role || '',
        status: searchParams.status || '',
        fromDate: searchParams.fromDate || '',
        toDate: searchParams.toDate || '',
      },
    })
    return ok(data?.results ?? { content: [], totalPages: 0, totalElements: 0, size, number: page }, data)
  } catch (error) {
    return normalizeError(error, '직원 검색에 실패했습니다.')
  }
}

export default {
  memberList,
  getMembers,
  memberDetail,
  getMemberDetail,
  memberCreate,
  createMember,
  memberEdit,
  updateMember,
  updateMemberStatus,
  memberEmailCheck,
  MemberSearch,
}
