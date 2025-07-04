import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const accountDirectoryApi = {
  getAccounts: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/account-directory`, { params });
    return response.data;
  },
  addAccount: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/account-directory`, data);
    return response.data;
  },
  updateAccount: async (ma_tk, data) => {
    const response = await axios.patch(`${API_BASE_URL}/account-directory/${ma_tk}`, data);
    return response.data;
  },
  deleteAccount: async (ma_tk) => {
    const response = await axios.delete(`${API_BASE_URL}/account-directory/${ma_tk}`);
    return response.data;
  },
  getAccount: async (ma_tk) => {
    const response = await axios.get(`${API_BASE_URL}/account-directory/${ma_tk}`);
    return response.data;
  },
  getAccountGroup: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/account-directory/group/list`, { params });
    console.log(response.data);
    return response.data;
  },
};

export default accountDirectoryApi;
