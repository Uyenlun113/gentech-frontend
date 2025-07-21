import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const phieuXuatDcApi = {
    createPhieuXuatDc: async (data) => {
        const response = await axios.post(`${API_BASE_URL}/ph85`, data);
        return response.data;
    },
    getPhieuXuatDc: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/ph85/${stt_rec}`);
        return response.data;
    },
    getAllPhieuXuatDc: async (params) => {
        const response = await axios.get(`${API_BASE_URL}/ph85`, { params });
        return response.data;
    },
    updatePhieuXuatDc: async (stt_rec, data) => {
        const response = await axios.put(`${API_BASE_URL}/ph85/update/${stt_rec}`, data);
        return response.data;
    },
    deletePhieuXuatDc: async (stt_rec) => {
        const response = await axios.delete(`${API_BASE_URL}/ph85/delete/${stt_rec}`);
        return response.data;
    },
    getCt85Data: async (stt_rec) => {
        const response = await axios.get(`${API_BASE_URL}/ph85/ct85/${stt_rec}`);
        return response.data;
    },
}

export default phieuXuatDcApi