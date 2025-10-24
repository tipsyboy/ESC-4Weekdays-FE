import api from '@/plugin/axiosInterceptor.js'

const memberLogin = async (req) => {
  let data = {}
  let url = '/login'

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
  let url = '/logout'

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
export default { memberLogin, memberLogout }
