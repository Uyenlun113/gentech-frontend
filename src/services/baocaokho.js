import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const baocaoKhoService = {
  getData: async (body) => {
    const response = await axios.post(
      `${API_BASE_URL}/baocaotonkho/tonkho`,
      body // gửi body
    );
    return response.data;
  },
};

export default baocaoKhoService;
