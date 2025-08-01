import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import hoaDonMuaDVApi from "../services/hoadonxuatkho";

export const useHoaDonXuatKhos = (params) => {
    return useQuery({
        queryKey: ["hoadonxuatkho", params],
        queryFn: () => hoaDonMuaDVApi.getHoaDonXuatKhos(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useHoaDonXuatKho = (ma_pt) => {
    return useQuery({
        queryKey: ["hoadonxuatkho", ma_pt],
        queryFn: () => hoaDonMuaDVApi.getHoaDonXuatKho(ma_pt),
        enabled: !!ma_pt,
        refetchOnWindowFocus: false
    });
};

export const useCreateHoaDonXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: hoaDonMuaDVApi.createHoaDonXuatKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hoadonxuatkho"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdateHoaDonXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => hoaDonMuaDVApi.updateHoaDonXuatKho(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["hoadonxuatkho"] });
            queryClient.invalidateQueries({ queryKey: ["hoadonxuatkho", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeleteHoaDonXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: hoaDonMuaDVApi.deleteHoaDonXuatKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hoadonxuatkho"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};