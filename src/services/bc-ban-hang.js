import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const bcBanHangPhaiThuService = {
    getData: async (params) => {
        const query = new URLSearchParams(params).toString();
        const response = await axios.get(`${API_BASE_URL}/bcbanhang/hd-ban-hang?${query}`);
        return response.data;
    }
};

export default bcBanHangPhaiThuService;
