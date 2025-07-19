import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const dmsttService = {
    getDmstt: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/dmstt`, { params });
        return response.data;
    },
    updateDmstt: async (stt_rec, data) => {
        const response = await axios.patch(`${API_BASE_URL}/dmstt/${stt_rec}`, data);
        return response.data;
    },
}

export default dmsttService;