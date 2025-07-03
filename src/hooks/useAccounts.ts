import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import accountDirectoryApi from '../services/account-directory';

export const useAccounts = (params = {}) => {
    return useQuery({
        queryKey: ['accounts', params],
        queryFn: () => accountDirectoryApi.getAccounts(params),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export const useAccount = (tk0) => {
    return useQuery({
        queryKey: ['account', tk0],
        queryFn: () => accountDirectoryApi.getAccount(tk0),
        enabled: !!tk0,
    });
};

// Hook để tạo tài khoản mới
export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountDirectoryApi.addAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Tạo tài khoản thành công!');
        },
        onError: (error) => {
            console.error('Create account error:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản';
            toast.error(errorMessage);
        },
    });
};

// Hook để cập nhật tài khoản
export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tk0, data }) => accountDirectoryApi.updateAccount(tk0, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['account', variables.tk0] });
            toast.success('Cập nhật tài khoản thành công!');
        },
        onError: (error) => {
            console.error('Update account error:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản';
            toast.error(errorMessage);
        },
    });
};

// Hook để xóa tài khoản
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountDirectoryApi.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Xóa tài khoản thành công!');
        },
        onError: (error) => {
            console.error('Delete account error:', error);
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản';
            toast.error(errorMessage);
        },
    });
};

//Hook nhóm tài khoản
export const useGroupAccounts = (searchParams = {}) => {
    return useQuery({
        queryKey: ['groupAccounts', searchParams],
        queryFn: () => accountDirectoryApi.getAccountGroup(searchParams),
        staleTime: 5 * 60 * 1000, // 5 phút
        enabled: true,
    });
};