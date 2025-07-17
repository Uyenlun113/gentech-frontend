import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import giayBaoNoApi from "../services/giaybaono";

export const useGiayBaoNos = (params) => {
    return useQuery({
        queryKey: ["giaybaono", params],
        queryFn: () => giayBaoNoApi.getGiayBaoNos(params),
        staleTime: Infinity,
    });
};

export const useGiayBaoNo = (ma_pt) => {
    return useQuery({
        queryKey: ["cashReceipt", ma_pt],
        queryFn: () => giayBaoNoApi.getGiayBaoNo(ma_pt),
        enabled: !!ma_pt,
    });
};

export const useCreateGiayBaoNo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: giayBaoNoApi.createGiayBaoNo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["giaybaono"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdateGiayBaoNo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => giayBaoNoApi.updateGiayBaoNo(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["giaybaono"] });
            queryClient.invalidateQueries({ queryKey: ["cashReceipt", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeleteGiayBaoNo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: giayBaoNoApi.deleteGiayBaoNo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["giaybaono"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};