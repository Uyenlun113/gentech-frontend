import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const donHangMuaApi = {
  getDonHangMuas: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/donhangmua`, { params });
    return res.data;
  },
  getDonHangMua: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/donhangmua/${ma_pt}`);
    return res.data;
  },
  createDonHangMua: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/donhangmua`, data);
    return res.data;
  },
  updateDonHangMua: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/donhangmua/${ma_pt}`, data);
    return res.data;
  },
  deleteDonHangMua: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/donhangmua/${ma_pt}`);
    return res.data;
  },
};

export default donHangMuaApi;