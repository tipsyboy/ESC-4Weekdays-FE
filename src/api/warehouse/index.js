import api from '@/plugin/axiosInterceptor.js';

const warehouseCreate = async (req) => {
    let data = {};
    let url = '/api/warehouses';

    await api.post(url, req)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const warehouseRead = async (id) => {
    let data = {};
    let url = `/api/warehouses/${id}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const warehouseReadAll = async (page, size) => {
    let data = {};
    let url = '/api/warehouses/list';

    await api.get(url, {params: {page, size}})
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const warehouseUpdate = async (id) => {
    let data = {};
    let url = `/api/warehouses/${id}`;

    await api.patch(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

export default {warehouseCreate, warehouseRead, warehouseReadAll, warehouseUpdate};