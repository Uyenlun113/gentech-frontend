import { useMutation, useQuery } from "@tanstack/react-query";
import generalLedgerApi from "../services/generalLedger";

export const useSaveGeneralAccounting = () => {
    return useMutation({
        mutationFn: async (payload: any) => {
            return await generalLedgerApi.createGeneralLedger(payload);
        },
        onSuccess: () => {
            // Có thể invalidate queries liên quan
            // queryClient.invalidateQueries(['generalAccounting']);
        }
    });
};

export const useGetGeneralAccounting = () => {
    return useQuery({
        queryKey: ['generalAccounting'],
        queryFn: async () => {
            return await generalLedgerApi.getGeneralLedger();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

export const useFetchCt11Data = (stt_rec?: string) => {
    return useQuery({
        queryKey: ['ct11Data', stt_rec],
        queryFn: async () => {
            if (!stt_rec) {
                throw new Error('stt_rec is required');
            }
            return await generalLedgerApi.fetchCt11Data(stt_rec);
        },
        enabled: !!stt_rec,
        staleTime: 3 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 2,
    });
};