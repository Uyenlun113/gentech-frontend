import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cdvtService from '../services/cdvt';


export const useCdvtList = (ma_kho, nam, page = 1, limit = 10) => {
    const isReady = Boolean(ma_kho && nam);
    return useQuery({
        queryKey: ['cdvt', ma_kho, nam, page, limit],
        queryFn: () => cdvtService.getByYear(ma_kho, nam, page, limit),
        enabled: isReady,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
};

export const useCreateCdvt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cdvtService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['cdvt']);
        },
    });
};

export const useUpdateCdvt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ma_vt, ma_kho, nam, data }) =>
            cdvtService.updateByVtKhoNam(ma_vt, ma_kho, nam, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['cdvt']);
        },
    });
};

export const useDeleteCdvt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ma_vt, ma_kho, nam }) =>
            cdvtService.deleteByVtKhoNam(ma_vt, ma_kho, nam),
        onSuccess: () => {
            queryClient.invalidateQueries(['cdvt']);
        },
    });
};
