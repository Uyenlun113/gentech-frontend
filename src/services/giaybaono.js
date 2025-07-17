import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const giayBaoNoApi = {
  getGiayBaoNos: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/giaybaono`, { params });
    return res.data;
  },
  getGiayBaoNo: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/giaybaono/${ma_pt}`);
    return res.data;
  },
  createGiayBaoNo: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/giaybaono`, data);
    return res.data;
  },
  updateGiayBaoNo: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/giaybaono/${ma_pt}`, data);
    return res.data;
  },
  deleteGiayBaoNo: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/giaybaono/${ma_pt}`);
    return res.data;
  },
};

export default giayBaoNoApi;