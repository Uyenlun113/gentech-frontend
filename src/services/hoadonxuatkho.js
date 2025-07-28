import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const hoaDonXuatKhoApi = {
  getHoaDonXuatKhos: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/hoadonxuatkho`, { params });
    return res.data;
  },
  getHoaDonXuatKho: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/hoadonxuatkho/${ma_pt}`);
    return res.data;
  },
  createHoaDonXuatKho: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/hoadonxuatkho`, data);
    return res.data;
  },
  updateHoaDonXuatKho: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/hoadonxuatkho/${ma_pt}`, data);
    return res.data;
  },
  deleteHoaDonXuatKho: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/hoadonxuatkho/${ma_pt}`);
    return res.data;
  },
};

export default hoaDonXuatKhoApi;