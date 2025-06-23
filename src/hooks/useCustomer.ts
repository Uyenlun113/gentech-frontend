import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import customerApi, { CustomerQueryParams, UpdateCustomerRequest } from '../services/category-customer';


export const useCustomers = (params: CustomerQueryParams) => {
    return useQuery({
        queryKey: ['customers', params],
        queryFn: () => customerApi.getCustomers(params),
        staleTime: Infinity,
    });
};

export const useCustomer = (ma_kh: string) => {
    return useQuery({
        queryKey: ['customer', ma_kh],
        queryFn: () => customerApi.getCustomer(ma_kh),
        enabled: !!ma_kh,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerApi.createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Tạo khách hàng thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo khách hàng');
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ma_kh, data }: { ma_kh: string; data: UpdateCustomerRequest }) =>
            customerApi.updateCustomer(ma_kh, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['customer', variables.data.ma_kh] });
            toast.success('Cập nhật khách hàng thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khách hàng');
        },
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerApi.deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            toast.success('Xóa khách hàng thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa khách hàng');
        },
    });
}; 