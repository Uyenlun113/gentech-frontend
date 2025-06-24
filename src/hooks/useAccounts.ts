import { useQuery } from '@tanstack/react-query';
import accountDirectoryApi from '../services/account-directory';


export const useAccounts = (params = {}) => {
    return useQuery({
        queryKey: ['accounts', params],
        queryFn: () => accountDirectoryApi.getAccounts(params),
        staleTime: Infinity,
    });
};