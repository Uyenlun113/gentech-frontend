import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const customerApi = {
  getCustomers: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/category-customer`, { params });
    return response.data;
  },

  getCustomer: async (ma_kh) => {
    const response = await axios.get(`${API_BASE_URL}/category-customer/${ma_kh}`);
    return response.data;
  },

  createCustomer: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/category-customer`, data);
    return response.data;
  },

  updateCustomer: async (ma_kh, data) => {
    const response = await axios.patch(`${API_BASE_URL}/category-customer/${ma_kh}`, data);
    return response.data;
  },

  deleteCustomer: async (ma_kh) => {
    await axios.delete(`${API_BASE_URL}/category-customer/${ma_kh}`);
  },
};

export default customerApi;
