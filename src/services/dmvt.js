import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const dmvtService = {
    getDmvt: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/materials`, { params });
        return response.data;
    },
    addDmvt: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/materials`, data);
        return response.data;
    },
    updateDmvt: async (ma_vt, data) => {
        const response = await axios.patch(`${API_BASE_URL}/materials/${ma_vt}`, data);
        return response.data;
    },
    deleteDmvt: async (ma_vt) => {
        const response = await axios.delete(`${API_BASE_URL}/materials/${ma_vt}`);
        return response.data;
    },
    getDmvtById: async (ma_vt) => {
        const response = await axios.get(`${API_BASE_URL}/materials/${ma_vt}`);
        return response.data;
    },
};

export default dmvtService;
