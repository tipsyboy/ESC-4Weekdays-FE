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

const searchProducts = async (page, size, searchForm = {}) => {
    const requestUrl = `/api/products/search?page=${page}&size=${size}`;
    const requestUrlWithEs = `/api/products/search/es?page=${page}&size=${size}`;

    return await api.post(requestUrl, searchForm)
        .then((response) => {
          console.log(response)
          return response.data.results
        })
        .catch((error) => {
          console.error(error)
          throw error;
        });
};

export default {productCreate, productDetail, searchProducts};