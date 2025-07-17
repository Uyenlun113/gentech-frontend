import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const giayBaoCoApi = {
  getGiayBaoCos: async (params) => {
    const res = await axios.get(`${API_BASE_URL}/giaybaoco`, { params });
    return res.data;
  },
  getGiayBaoCo: async (ma_pt) => {
    const res = await axios.get(`${API_BASE_URL}/giaybaoco/${ma_pt}`);
    return res.data;
  },
  createGiayBaoCo: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/giaybaoco`, data);
    return res.data;
  },
  updateGiayBaoCo: async (ma_pt, data) => {
    const res = await axios.put(`${API_BASE_URL}/giaybaoco/${ma_pt}`, data);
    return res.data;
  },
  deleteGiayBaoCo: async (ma_pt) => {
    const res = await axios.delete(`${API_BASE_URL}/giaybaoco/${ma_pt}`);
    return res.data;
  },
};

export default giayBaoCoApi;