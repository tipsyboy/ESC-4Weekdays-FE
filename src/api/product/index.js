import api from '@/plugin/axiosInterceptor';

const productCreate = async (req) => {
    let data = {};
    let url = '/api/products';

    await api.post(url, req)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const productDetail = async (id) => {
    let data = {};
    let url = `/api/products/${id}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const productList = async (page, size) => {
    let data = {};
    let url = `/api/products`;

    await api.get(url, {params: {page, size}})
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

export default {productCreate, productDetail, productList};