import axios from 'axios'

axios.defaults.withCredentials = true

let isRefreshing = false
let refreshQueue = []

const resolveRefreshQueue = (error = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }
    resolve()
  })
  refreshQueue = []
}

const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    // console.log('요청 보내기 전 실행')
    console.log("요청 URL:", config.baseURL + config.url); // 테스트용
    return config
  },
  (error) => {
    // console.log('요청할 때 에러 처리')
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    // console.log('응답을 받기 전 실행')
    return response
  },
  async (error) => {
    // console.log('응답 받을 때 에러 처리')

    // const userStore = useUserStore()
    //
    // if (error.response.data.code == 30008) {
    //   alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.')
    //   userStore.logout()
    // }

    const originalRequest = error.config
    const status = error.response?.status
    const requestUrl = originalRequest?.url || ''
    const isAuthRequest = requestUrl.includes('/api/login')
      || requestUrl.includes('/api/auth/reissue')
      || requestUrl.includes('/api/auth/logout')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
      }

      isRefreshing = true

      try {
        await axios.post('/api/auth/reissue', null, { withCredentials: true })
        resolveRefreshQueue()
        return api(originalRequest)
      } catch (refreshError) {
        resolveRefreshQueue(refreshError)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
