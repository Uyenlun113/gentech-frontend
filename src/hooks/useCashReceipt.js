import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import cashReceiptApi from "../services/cash-receipt";

export const useCashReceipts = (params) => {
    return useQuery({
        queryKey: ["cashReceipts", params],
        queryFn: () => cashReceiptApi.getCashReceipts(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useCashReceipt = (ma_pt) => {
    return useQuery({
        queryKey: ["cashReceipt", ma_pt],
        queryFn: () => cashReceiptApi.getCashReceipt(ma_pt),
        enabled: !!ma_pt,
    });
};

export const useCreateCashReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cashReceiptApi.createCashReceipt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            toast.success("Tạo phiếu thu thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu thu");
        },
    });
};

export const useUpdateCashReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => cashReceiptApi.updateCashReceipt(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            queryClient.invalidateQueries({ queryKey: ["cashReceipt", variables.stt_rec] });
            toast.success("Cập nhật phiếu thu thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật phiếu thu");
        },
    });
};

export const useDeleteCashReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cashReceiptApi.deleteCashReceipt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cashReceipts"] });
            toast.success("Xóa phiếu thu thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa phiếu thu");
        },
    });
};