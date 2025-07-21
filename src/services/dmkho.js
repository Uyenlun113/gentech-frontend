import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DmkhoService = {
    getDmkho: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/dmkho`, { params });
        return response.data;
    },
    getDmkhoById: async (ma_kho) => {
        const response = await axios.get(`${API_BASE_URL}/dmkho/${ma_kho}`);
        return response.data;
    },
    addDmkho: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/dmkho`, data);
        return response.data;
    },
    updateDmkho: async (ma_kho, data) => {
        const response = await axios.patch(`${API_BASE_URL}/dmkho/update/${ma_kho}`, data);
        return response.data;
    },
    deleteDmkho: async (ma_kho) => {
        await axios.delete(`${API_BASE_URL}/dmkho/delete/${ma_kho}`);
    },
};

export default DmkhoService;