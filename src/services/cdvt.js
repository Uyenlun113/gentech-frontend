import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cdvtService = {
    create: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/cdvt`, data);
        return response.data;
    },

    getByYear: async (ma_kho, nam, page = 1, limit = 10) => {
        const response = await axios.get(`${API_BASE_URL}/cdvt`, {
            params: { ma_kho, nam, page, limit },
        });
        return response.data;
    },

    findById: async (ma_vt, ma_kho, nam) => {
        const response = await axios.get(`${API_BASE_URL}/cdvt/findById`, {
            params: { ma_vt, ma_kho, nam },
        });
        return response.data;
    },

    updateByVtKhoNam: async (ma_vt, ma_kho, nam, data) => {
        const response = await axios.patch(
            `${API_BASE_URL}/cdvt/update/${ma_vt}/${ma_kho}/${nam}`,
            data
        );
        return response.data;
    },

    deleteByVtKhoNam: async (ma_vt, ma_kho, nam) => {
        const response = await axios.delete(
            `${API_BASE_URL}/cdvt/delete/${ma_vt}/${ma_kho}/${nam}`
        );
        return response.data;
    },
};

export default cdvtService;
