import api from '@/plugin/axiosInterceptor';

const fileUpload = async (req) => {
    let data = {};
    let url = '/api/files/upload';

    const headers = {'Content-Type': 'multipart/form-data',};

    await api.post(url, req, {headers})
        .then((res) => {
            data = res.data;
        })
        .catch((error) => {
            data = error.data;
        });

    return data;
};

export default {fileUpload,};