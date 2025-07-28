import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const hdBanDvService = {
    getHdBanDvs: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/hd-ban-dv`, { params });
        return response.data;
    },
    getHdBanDvById: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/hd-ban-dv/${stt_rec}`);
        return response.data;
    },
    createHdBanDv: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/hd-ban-dv`, data);
        return response.data;
    },
    updateHdBanDv: async (stt_rec, data) => {
        const response = await axios.patch(`${API_BASE_URL}/hd-ban-dv/${stt_rec}`, data);
        return response.data;
    },
    deleteHdBanDv: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/hd-ban-dv/${stt_rec}`);
        return response.data;
    },
}

export default hdBanDvService