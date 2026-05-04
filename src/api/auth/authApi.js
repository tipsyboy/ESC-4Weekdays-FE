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

const ok = (data) => ({
  success: data?.success ?? true,
  code: data?.code ?? 20000,
  message: data?.message ?? '',
  results: data?.results ?? null,
})

const login = async (payload) => {
  try {
    const { data } = await api.post('/api/login', payload)
    return ok(data)
  } catch (error) {
    return normalizeError(error, '로그인에 실패했습니다.')
  }
}

const me = async () => {
  try {
    const { data } = await api.get('/api/auth/me')
    return ok(data)
  } catch (error) {
    return normalizeError(error, '로그인 정보 조회에 실패했습니다.')
  }
}

const logout = async () => {
  try {
    const { data } = await api.post('/api/auth/logout')
    return ok(data)
  } catch (error) {
    return normalizeError(error, '로그아웃에 실패했습니다.')
  }
}

const reissue = async () => {
  try {
    const { data } = await api.post('/api/auth/reissue')
    return ok(data)
  } catch (error) {
    return normalizeError(error, '세션 재발급에 실패했습니다.')
  }
}

export default {
  login,
  me,
  logout,
  reissue,
}
