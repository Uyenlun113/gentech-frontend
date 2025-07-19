import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cdtkService = {
    // ✅ Thêm mới
    createBulk: async (dataArray) => {
        const response = await axios.post(`${API_BASE_URL}/cdtk/bulk`, dataArray);
        return response.data;
    },

    // ✅ Lấy theo năm
    getByYear: async (nam) => {
        const response = await axios.get(`${API_BASE_URL}/cdtk`, {
            params: { nam },
        });
        return response.data;
    },

    // ✅ Cập nhật theo tk và năm
    updateByTkAndYear: async (tk, nam, data) => {
        const response = await axios.put(`${API_BASE_URL}/cdtk`, data, {
            params: { tk, nam },
        });
        return response.data;
    },

    findOne: async (tk, nam) => {
        const response = await axios.get(`${API_BASE_URL}/cdtk/one`, {
            params: { tk, nam },
        });
        return response.data;
    },
};

export default cdtkService;
