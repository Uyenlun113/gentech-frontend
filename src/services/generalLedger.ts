import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const generalLedgerApi = {
    createGeneralLedger: async (payload: any) => {
        const response = await axios.post(`${API_BASE_URL}/general-accounting`, payload);
        return response.data;
    },

    updateGeneralLedger: async (stt_rec: string, payload: any) => {
        const response = await axios.put(`${API_BASE_URL}/general-accounting/update/${stt_rec}`, payload);
        return response.data;
    },

    deleteGeneralLedger: async (stt_rec: string) => {
        const response = await axios.delete(`${API_BASE_URL}/general-accounting/delete/${stt_rec}`);
        return response.data;
    },

    getGeneralLedger: async (params?: { page?: number; limit?: number; search?: string }) => {
        const response = await axios.get(`${API_BASE_URL}/general-accounting/ph11`, { params });
        return response.data;
    },

    getGeneralLedgerById: async (stt_rec: string) => {
        const response = await axios.get(`${API_BASE_URL}/general-accounting/find-one/${stt_rec}`);
        return response.data;
    },

    fetchCt11Data: async (stt_rec: string) => {
        const response = await axios.get(`${API_BASE_URL}/general-accounting/ct11/${stt_rec}`);
        return response.data;
    }
};

export default generalLedgerApi;