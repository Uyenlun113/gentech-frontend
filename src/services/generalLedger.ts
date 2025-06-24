import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const generalLedgerApi = {
    createGeneralLedger: async (payload: any) => {
        const response = await axios.post(`${API_BASE_URL}/general-accounting`, payload);
        return response.data;
    },
    getGeneralLedger: async () => {
        const response = await axios.get(`${API_BASE_URL}/general-accounting/ph11`);
        return response.data;
    },
    fetchCt11Data: async (stt_rec: string) => {
        const response = await axios.get(`${API_BASE_URL}/general-accounting/ct11/${stt_rec}`);
        return response.data;
    }
};

export default generalLedgerApi;