import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const phieuMuaApi = {
    getPhieuMuaList: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/phieu-mua`, { params });
        return response.data;
    },
    getPhieuMuaById: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/phieu-mua/${stt_rec}`);
        return response.data;
    },
    createPhieuMua: async (payload) => {
        const response = await axios.post(`${API_BASE_URL}/phieu-mua`, payload);
        return response.data;
    },
    updatePhieuMua: async (stt_rec, payload) => {
        const response = await axios.patch(`${API_BASE_URL}/phieu-mua/update/${stt_rec}`, payload);
        return response.data;
    },
    deletePhieuMua: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/phieu-mua/${stt_rec}`);
        return response.data;
    },
}

export default phieuMuaApi