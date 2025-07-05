import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const customerGroupService = {
    getDmnhkh: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/dmnhkh`, { params });
        return response.data;
    },
    addDmnhkh: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/dmnhkh`, data);
        return response.data;
    },
    updateDmnhkh: async (ma_kh, loai_nh, data) => {
        const response = await axios.patch(`${API_BASE_URL}/dmnhkh/update/${ma_kh}/${loai_nh}`, data);
        return response.data;
    },
    deleteDmnhkh: async (ma_kh, loai_nh) => {
        const response = await axios.delete(`${API_BASE_URL}/dmnhkh/delete/${ma_kh}/${loai_nh}`);
        return response.data;
    },
};

export default customerGroupService;