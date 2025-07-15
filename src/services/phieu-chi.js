import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ct46Api = {
    createCt46: async (payload) => {
        const response = await axios.post(`${API_BASE_URL}/phieu-chi`, payload);
        return response.data;
    },

    updateCt46: async (stt_rec, payload) => {
        const response = await axios.put(`${API_BASE_URL}/phieu-chi/${stt_rec}`, payload);
        return response.data;
    },

    deleteCt46: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/phieu-chi/${stt_rec}`);
        return response.data;
    },

    getCt46List: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/phieu-chi`, { params });
        return response.data;
    },

    getCt46ById: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/phieu-chi/${stt_rec}`);
        console.log(response.data);
        return response.data;
    },

    fetchCt46Data: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/phieu-chi/ct46/${stt_rec}`);
        return response.data;
    },
};

export default ct46Api;