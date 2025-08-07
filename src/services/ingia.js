import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const inGiaApi = {
    postInGia: async (payload) => {
        const response = await axios.post(`${API_BASE_URL}/ingia/call`, payload);
        return response.data;
    },
};

export default inGiaApi;