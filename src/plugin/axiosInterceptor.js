import axios from 'axios'

axios.defaults.withCredentials = true

// 현재 FE interceptor에서는 /api/auth/reissue를 사용하지 않는다.
// Refresh token 재발급은 BE JwtAuthenticationFilter가 만료된 access token 요청을 처리하면서 수행한다.
//
// 수동 reissue API를 다시 사용한다면 아래 블록을 복구한다.
// let isRefreshing = false
// let refreshQueue = []
//
// const flushRefreshQueue = (error = null) => {
//   refreshQueue.forEach(({ resolve, reject }) => {
//     if (error) {
//       reject(error)
//       return
//     }
//     resolve()
//   })
//   refreshQueue = []
// }

const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    console.log("요청 URL:", config.baseURL + config.url);
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 수동 reissue API를 다시 사용한다면 아래 블록을 복구한다.
    // const originalRequest = error.config
    // const status = error.response?.status
    // const requestUrl = originalRequest?.url || ''
    //
    // // 로그인/재발급/로그아웃 요청에서 401이 나면 다시 reissue를 시도하면 루프가 생긴다.
    // const isAuthRequest = requestUrl.includes('/api/login')
    //   || requestUrl.includes('/api/auth/reissue')
    //   || requestUrl.includes('/api/auth/logout')
    //
    // // 401이 아니거나 이미 재시도한 요청이면 그대로 실패시킨다.
    // if (status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
    //   return Promise.reject(error)
    // }
    //
    // originalRequest._retry = true
    //
    // // refresh token rotation 중 동시 401 요청이 여러 개 들어오면, 첫 요청만 reissue를 수행한다.
    // if (isRefreshing) {
    //   return new Promise((resolve, reject) => {
    //     refreshQueue.push({ resolve, reject })
    //   }).then(() => api(originalRequest))
    // }
    //
    // isRefreshing = true
    //
    // try {
    //   // HttpOnly refresh token 쿠키는 JS에서 읽지 않고, 요청에 쿠키만 포함해 BE가 검증하게 한다.
    //   await api.post('/api/auth/reissue')
    //   flushRefreshQueue()
    //
    //   // 새 쿠키가 설정된 뒤 실패했던 원 요청을 한 번만 다시 보낸다.
    //   return api(originalRequest)
    // } catch (refreshError) {
    //   // reissue가 실패하면 대기 중인 요청들도 모두 실패시키고 호출부에서 로그아웃 등을 판단하게 둔다.
    //   flushRefreshQueue(refreshError)
    //   return Promise.reject(refreshError)
    // } finally {
    //   isRefreshing = false
    // }

    return Promise.reject(error)
  },
)

export default api
