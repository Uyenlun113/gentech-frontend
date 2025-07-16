import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import giayBaoCoApi from "../services/giaybaoco";

export const useGiayBaoCos = (params) => {
    return useQuery({
        queryKey: ["cashReceipts", params],
        queryFn: () => giayBaoCoApi.getGiayBaoCos(params),
        staleTime: Infinity,
    });
};

export const useGiayBaoCo = (ma_pt) => {
    return useQuery({
        queryKey: ["cashReceipt", ma_pt],
        queryFn: () => giayBaoCoApi.getGiayBaoCo(ma_pt),
        enabled: !!ma_pt,
    });
};

export const useCreateGiayBaoCo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: giayBaoCoApi.createGiayBaoCo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdateGiayBaoCo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => giayBaoCoApi.updateGiayBaoCo(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            queryClient.invalidateQueries({ queryKey: ["cashReceipt", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeleteGiayBaoCo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: giayBaoCoApi.deleteGiayBaoCo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};