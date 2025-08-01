import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const vonBangTienService = {
    getData: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/baocaovonbangtien/tiengui`, data);
        return response.data;
    },
};

export default vonBangTienService;
