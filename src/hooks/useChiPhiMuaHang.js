import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import chiPhiMuaHangApi from "../services/chi-phi-mua-hang";


export const useListChiPhiMuaHang = (params) => {
    return useQuery({
        queryKey: ["chi-phi-mua-hang", params],
        queryFn: () => chiPhiMuaHangApi.getChiPhiMuaHang(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
};


export const useChiPhiMuaHangById = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["chi-phi-mua-hang", stt_rec],
        queryFn: () => chiPhiMuaHangApi.getChiPhiMuaHangById(stt_rec),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        enabled: !!stt_rec,
        ...options,
    });
};


export const useCreateChiPhiMuaHang = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: chiPhiMuaHangApi.createChiPhiMuaHang,
        onSuccess: () => {
            queryClient.invalidateQueries(["chi-phi-mua-hang"]);
        },
        ...options,
    });
};


export const useUpdateChiPhiMuaHang = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) =>
            chiPhiMuaHangApi.updateChiPhiMuaHang(stt_rec, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["chi-phi-mua-hang"]);
        },
        ...options,
    });
};


export const useDeleteChiPhiMuaHang = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stt_rec) => chiPhiMuaHangApi.deleteChiPhiMuaHang(stt_rec),
        onSuccess: () => {
            queryClient.invalidateQueries(["chi-phi-mua-hang"]);
        },
        ...options,
    });
};
