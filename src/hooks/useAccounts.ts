import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import accountDirectoryApi from '../services/account-directory';


export const useAccounts = (params = {}) => {
    return useQuery({
        queryKey: ['accounts', params],
        queryFn: () => accountDirectoryApi.getAccounts(params),
        staleTime: Infinity,
    });
};
export const useAccount = (tk: string) => {
    return useQuery({
        queryKey: ['account', tk],
        queryFn: () => accountDirectoryApi.getAccount(tk),
        enabled: !!tk,
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
    });
};

// Hook để cập nhật tài khoản
export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tk, data }) => accountDirectoryApi.updateAccount(tk, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['account', variables.tk] });
            toast.success('Cập nhật tài khoản thành cong!');
        },
    });
};

// Hook để xóa tài khoản
export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountDirectoryApi.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'], exact: false });
            toast.success('Xóa tài khoản thanh cong!');
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