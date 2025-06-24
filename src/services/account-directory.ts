import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export interface AccountQueryParams {
    search?: string;

}

const accountDirectoryApi = {
    getAccounts: async (params?: AccountQueryParams) => {
        const response = await axios.get(`${API_BASE_URL}/account-directory`, { params });
        return response.data;
    }
};

export default accountDirectoryApi;