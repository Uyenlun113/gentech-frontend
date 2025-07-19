import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const phieuNhapKhoApi = {
  getPhieuXuatKhos: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/phieuxuatkho`, { params });
    return res.data;
  },
  getPhieuXuatKho: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/phieuxuatkho/${ma_pt}`);
    return res.data;
  },
  createPhieuXuatKho: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/phieuxuatkho`, data);
    return res.data;
  },
  updatePhieuXuatKho: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/phieuxuatkho/${ma_pt}`, data);
    return res.data;
  },
  deletePhieuXuatKho: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/phieuxuatkho/${ma_pt}`);
    return res.data;
  },
};

export default phieuNhapKhoApi;