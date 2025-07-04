import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const cashReceiptApi = {
  getCashReceipts: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/cash-receipt`, { params });
    return res.data;
  },
  getCashReceipt: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/cash-receipt/${ma_pt}`);
    return res.data;
  },
  createCashReceipt: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/cash-receipt`, data);
    return res.data;
  },
  updateCashReceipt: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/cash-receipt/${ma_pt}`, data);
    return res.data;
  },
  deleteCashReceipt: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/cash-receipt/${ma_pt}`);
    return res.data;
  },
};

export default cashReceiptApi;