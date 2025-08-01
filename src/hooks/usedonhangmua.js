import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import donHangMuaApi from "../services/donhangmua";

export const useDonHangMuas = (params) => {
    return useQuery({
        queryKey: ["donhangmua", params],
        queryFn: () => donHangMuaApi.getDonHangMuas(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useDonHangMua = (ma_pt) => {
    return useQuery({
        queryKey: ["donhangmua", ma_pt],
        queryFn: () => donHangMuaApi.getDonHangMua(ma_pt),
        enabled: !!ma_pt,
        refetchOnWindowFocus: false
    });
};

export const useCreateDonHangMua = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: donHangMuaApi.createDonHangMua,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donhangmua"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdateDonHangMua = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => donHangMuaApi.updateDonHangMua(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["donhangmua"] });
            queryClient.invalidateQueries({ queryKey: ["donhangmua", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeleteDonHangMua = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: donHangMuaApi.deleteDonHangMua,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donhangmua"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};