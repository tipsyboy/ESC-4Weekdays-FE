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

const memberList = async (page = 0, size = 20) => {
  try {
    const { data } = await api.get('/api/members', { params: { page, size } })
    return ok({ data }, { content: [], totalPages: 0, totalElements: 0, size, number: page })
  } catch (error) {
    return fail(error, '직원 목록 조회에 실패했습니다.')
  }
}

const getMembers = async () => memberList(0, 200)

const memberDetail = async (id) => {
  try {
    const { data } = await api.get(`/api/members/${id}`)
    return ok({ data })
  } catch (error) {
    return fail(error, '직원 상세 조회에 실패했습니다.')
  }
}

const getMemberDetail = async (id) => memberDetail(id)

const memberCreate = async (payload) => {
  try {
    const { data } = await api.post('/api/members', payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '직원 등록에 실패했습니다.')
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
    return ok({ data })
  } catch (error) {
    return fail(error, '직원 수정에 실패했습니다.')
  }
}

const updateMember = async (id, payload) => memberEdit(id, payload)

const updateMemberStatus = async (id, status) => {
  try {
    const { data } = await api.patch(`/api/members/${id}/status`, { status })
    return ok({ data })
  } catch (error) {
    return fail(error, '직원 상태 변경에 실패했습니다.')
  }
}

const memberEmailCheck = async (payload) => {
  try {
    const { data } = await api.post('/api/members/check-email', payload)
    return ok({ data }, data?.message ?? null)
  } catch (error) {
    return fail(error, '이메일 중복 확인에 실패했습니다.')
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
    return ok({ data }, { content: [], totalPages: 0, totalElements: 0, size, number: page })
  } catch (error) {
    return fail(error, '직원 검색에 실패했습니다.')
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
