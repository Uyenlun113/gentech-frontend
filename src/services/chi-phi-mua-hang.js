import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const chiPhiMuaHangApi = {
    getChiPhiMuaHang: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/chi-phi-mua-hang`, { params });
        return response.data;
    },
    createChiPhiMuaHang: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/chi-phi-mua-hang`, data);
        return response.data;
    },
    updateChiPhiMuaHang: async (stt_rec, data) => {
        const response = await axios.patch(`${API_BASE_URL}/chi-phi-mua-hang/${stt_rec}`, data);
        return response.data;
    },
    deleteChiPhiMuaHang: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/chi-phi-mua-hang/${stt_rec}`);
        return response.data;
    },
    getChiPhiMuaHangById: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/chi-phi-mua-hang/${stt_rec}`);
        return response.data;
    },
}
export default chiPhiMuaHangApi