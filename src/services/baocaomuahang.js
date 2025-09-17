import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const baocaoMuaHangService = {
  getData: async (body) => {
    const response = await axios.post(
      `${API_BASE_URL}/baocaomuahang/muahang`,
      body // gửi body
    );
    return response.data;
  },
};

export default baocaoMuaHangService;
