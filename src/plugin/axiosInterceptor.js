import axios from 'axios'

axios.defaults.withCredentials = true

const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: '',
  timeout: 5000,
})

api.interceptors.request.use(
  (config) => {
    // console.log('요청 보내기 전 실행')
    // console.log("요청 URL:", config.baseURL + config.url); // 테스트용
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
  (error) => {
    // console.log('응답 받을 때 에러 처리')

    // const userStore = useUserStore()
    //
    // if (error.response.data.code == 30008) {
    //   alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.')
    //   userStore.logout()
    // }

    return Promise.reject(error)
  },
)

export default api
