import api from '@/plugin/axiosInterceptor'

const announcementCreate = async (req) => {
  let data = {}
  let url = '/api/announcement'

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

const announcementDetail = async (id) => {
  let data = {}
  let url = `/api/announcement/${id}`

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

const announcementList = async (page, size) => {
  let data = {}
  let url = `/api/announcement/list`

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

const announcementDelete = async (id) => {
  let data = {}
  let url = `/api/announcement/${id}`

  await api
    .delete(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

const announcementEdit = async (id) => {
  let data = {}
  let url = `/api/announcement/${id}`

  await api
    .patch(url)
    .then((res) => {
      data = res.data
    })
    .catch((error) => {
      data = error.data
    })

  return data
}

export default {
  announcementCreate,
  announcementDetail,
  announcementList,
  announcementDelete,
  announcementEdit,
}
