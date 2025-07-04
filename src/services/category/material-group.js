import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const materialGroupService = {
  getMaterialGroups: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/dmnhvt`, { params });
    return response.data;
  },

  addMaterialGroup: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/dmnhvt/create`, data);
    return response.data;
  },

  updateMaterialGroup: async (loai_nh, ma_nh, data) => {
    const response = await axios.patch(`${API_BASE_URL}/dmnhvt/update/${loai_nh}/${ma_nh}`, data);
    return response.data;
  },

  deleteMaterialGroup: async (loai_nh, ma_nh) => {
    const response = await axios.delete(`${API_BASE_URL}/dmnhvt/delete/${loai_nh}/${ma_nh}`);
    return response.data;
  },

  getMaterialGroupById: async (loai_nh, ma_nh) => {
    const response = await axios.get(`${API_BASE_URL}/dmnhvt/${loai_nh}/${ma_nh}`);
    return response.data;
  },
};

export default materialGroupService;
