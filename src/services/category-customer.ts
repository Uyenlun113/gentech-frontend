import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Customer {
    ma_kh: string;
    ten_kh: string;
    e_mail?: string;
    dien_thoai?: string;
    dia_chi?: string;
    ma_so_thue?: string;
    ma_tra_cuu?: string;
    tk_nh?: string;
    ten_nh?: string;
    ghi_chu?: string;
    status: string;

}

export interface CreateCustomerRequest {
    ten_kh: string;
    e_mail?: string;
    dien_thoai?: string;
    dia_chi?: string;
    ma_so_thue?: string;
    ma_tra_cuu?: string;
    tk_nh?: string;
    ten_nh?: string;
    ghi_chu?: string;

}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> { 
    status?: string;

}

export interface CustomerQueryParams {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export interface CustomerListResponse {
    status: number;
    message: string;
    data: Customer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CustomerResponse {
    status: number;
    message: string;
    data: Customer;
}

const customerApi = {
    getCustomers: async (params: CustomerQueryParams): Promise<CustomerListResponse> => {
        const response = await axios.get(`${API_BASE_URL}/category-customer`, { params });
        return response.data;
    },

    getCustomer: async (ma_kh: string): Promise<CustomerResponse> => {
        const response = await axios.get(`${API_BASE_URL}/category-customer/${ma_kh}`);
        return response.data;
    },

    createCustomer: async (data: CreateCustomerRequest): Promise<CustomerResponse> => {
        const response = await axios.post(`${API_BASE_URL}/category-customer`, data);
        return response.data;
    },

    updateCustomer: async (ma_kh: string, data: UpdateCustomerRequest): Promise<CustomerResponse> => {
        const response = await axios.patch(`${API_BASE_URL}/category-customer/${ma_kh}`, data);
        return response.data;
    },

    deleteCustomer: async (ma_kh: string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/category-customer/${ma_kh}`);
    },
};

export default customerApi;