import api from '@/plugin/axiosInterceptor.js'

const orderRead = async (page = 0, size = 10) => {
    let data = {}
    let url = '/api/admin/order'

    await api
        .get(url, {params: {page, size}})
        .then((res) => {
            data = res.data
        })
        .catch((error) => {
            data = error.data
        })

    return data
}

const orderDetail = async (id) => {
    let data = {};
    let url = `/api/admin/order/${id}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const orderReject = async (id) => {
    let data = {};
    let url = `/api/admin/order/${id}`;

    await api.patch(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

export default {
    orderRead,
    orderDetail,
    orderReject,
}
