import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const login = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return response.data;
};
export const getUserInfo = async (accessToken) => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
