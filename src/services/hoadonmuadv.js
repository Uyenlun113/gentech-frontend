import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const hoaDonMuaDVApi = {
  getHoaDonMuaDVs: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/hoadonmuadv`, { params });
    return res.data;
  },
  getHoaDonMuaDV: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/hoadonmuadv/${ma_pt}`);
    return res.data;
  },
  createHoaDonMuaDV: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/hoadonmuadv`, data);
    return res.data;
  },
  updateHoaDonMuaDV: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/hoadonmuadv/${ma_pt}`, data);
    return res.data;
  },
  deleteHoaDonMuaDV: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/hoadonmuadv/${ma_pt}`);
    return res.data;
  },
};

export default hoaDonMuaDVApi;