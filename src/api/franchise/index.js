import api from "@/plugin/axiosInterceptor.js";

const franchiseCreate = async (req) => {
    let data = {};
    let url = '/api/franchises';

    await api.post(url, req)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const franchiseRead = async (id) => {
    let data = {};
    let url = `/api/franchises/${id}`;

    await api.get(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const franchiseReadAll = async (page, size) => {
    let data = {};
    let url = '/api/franchises/list';

    await api.get(url, {params: {page, size}})
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const franchiseUpdate = async (id) => {
    let data = {};
    let url = `/api/franchises/${id}`;

    await api.patch(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

const franchiseDelete = async (id) => {
    let data = {};
    let url = `/api/franchises/${id}`;

    await api.delete(url)
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

export default {franchiseCreate, franchiseRead, franchiseReadAll, franchiseUpdate, franchiseDelete};