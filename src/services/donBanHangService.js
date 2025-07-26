import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const donBanHangService = {
    getDonBanHangs: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/don-ban-hang`, { params });
        return response.data;
    },
    getDonBanHangById: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/don-ban-hang/${stt_rec}`);
        return response.data;
    },
    createDonBanHang: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/don-ban-hang`, data);
        return response.data;
    },
    updateDonBanHang: async (stt_rec, data) => {
        const response = await axios.patch(`${API_BASE_URL}/don-ban-hang/${stt_rec}`, data);
        return response.data;
    },
    deleteDonBanHang: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/don-ban-hang/${stt_rec}`);
        return response.data;
    },
}

export default donBanHangService