import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import hoaDonMuaDVApi from "../services/hoadonmuadv";

export const useHoaDonMuaDVs = (params) => {
    return useQuery({
        queryKey: ["hoadonmuadv", params],
        queryFn: () => hoaDonMuaDVApi.getHoaDonMuaDVs(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useHoaDonMuaDV = (ma_pt) => {
    return useQuery({
        queryKey: ["hoadonmuadv", ma_pt],
        queryFn: () => hoaDonMuaDVApi.getHoaDonMuaDV(ma_pt),
        enabled: !!ma_pt,
        refetchOnWindowFocus: false
    });
};

export const useCreateHoaDonMuaDV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: hoaDonMuaDVApi.createHoaDonMuaDV,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hoadonmuadv"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdateHoaDonMuaDV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => hoaDonMuaDVApi.updateHoaDonMuaDV(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["hoadonmuadv"] });
            queryClient.invalidateQueries({ queryKey: ["hoadonmuadv", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeleteHoaDonMuaDV = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: hoaDonMuaDVApi.deleteHoaDonMuaDV,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hoadonmuadv"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};