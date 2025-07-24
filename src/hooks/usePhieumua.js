import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import phieuMuaApi from "../services/phieu-mua";

export const useListPhieuMua = (params = {}) => {
    return useQuery({
        queryKey: ["phieu-mua-list", params],
        queryFn: () => phieuMuaApi.getPhieuMuaList(params),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};

export const usePhieuMuaById = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["phieu-mua-detail", stt_rec],
        queryFn: () => phieuMuaApi.getPhieuMuaById(stt_rec),
        enabled: !!stt_rec,
        staleTime: 1000 * 60 * 5,
        retry: 2,
        ...options,
    });
};

export const useCreatePhieuMua = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: phieuMuaApi.createPhieuMua,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieu-mua-list"] });
        },
    });
};

export const useUpdatePhieuMua = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ stt_rec, data }) => phieuMuaApi.updatePhieuMua(stt_rec, data),
        onSuccess: (_, { stt_rec }) => {
            queryClient.invalidateQueries({ queryKey: ["phieu-mua-detail", stt_rec] });
            queryClient.invalidateQueries({ queryKey: ["phieu-mua-list"] });
        },
    });
};

export const useDeletePhieuMua = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: phieuMuaApi.deletePhieuMua,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieu-mua-list"] });
        },
    });
};