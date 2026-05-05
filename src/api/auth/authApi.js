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

const login = async (payload) => {
  try {
    const { data } = await api.post('/api/login', payload)
    return ok({ data })
  } catch (error) {
    return fail(error, '로그인에 실패했습니다.')
  }
}

const me = async () => {
  try {
    const { data } = await api.get('/api/auth/me')
    return ok({ data })
  } catch (error) {
    return fail(error, '로그인 정보 조회에 실패했습니다.')
  }
}

const logout = async () => {
  try {
    const { data } = await api.post('/api/auth/logout')
    return ok({ data })
  } catch (error) {
    return fail(error, '로그아웃에 실패했습니다.')
  }
}

const reissue = async () => {
  try {
    const { data } = await api.post('/api/auth/reissue')
    return ok({ data })
  } catch (error) {
    return fail(error, '세션 재발급에 실패했습니다.')
  }
}

export default {
  login,
  me,
  logout,
  reissue,
}
