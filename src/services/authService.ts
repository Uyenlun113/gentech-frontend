import axios from 'axios';

export interface LoginPayload {
    user_name: string;
    password: string;
}

export const login = async (payload: LoginPayload) => {
    const response = await axios.post('http://localhost:8000/auth/login', payload);
    return response.data;
};