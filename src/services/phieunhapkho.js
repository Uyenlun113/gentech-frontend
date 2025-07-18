import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const phieuNhapKhoApi = {
  getPhieuNhapKhos: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/phieunhapkho`, { params });
    return res.data;
  },
  getPhieuNhapKho: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/phieunhapkho/${ma_pt}`);
    return res.data;
  },
  createPhieuNhapKho: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/phieunhapkho`, data);
    return res.data;
  },
  updatePhieuNhapKho: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/phieunhapkho/${ma_pt}`, data);
    return res.data;
  },
  deletePhieuNhapKho: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/phieunhapkho/${ma_pt}`);
    return res.data;
  },
};

export default phieuNhapKhoApi;