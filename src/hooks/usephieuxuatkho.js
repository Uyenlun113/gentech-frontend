import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import phieuXuatKhoApi from "../services/phieuxuatkho";

export const usePhieuXuatKhos = (params) => {
    return useQuery({
        queryKey: ["phieuxuatkho", params],
        queryFn: () => phieuXuatKhoApi.getPhieuXuatKhos(params),
        staleTime: Infinity,
    });
};

export const usePhieuXuatKho = (ma_pt) => {
    return useQuery({
        queryKey: ["phieuxuatkho", ma_pt],
        queryFn: () => phieuXuatKhoApi.getPhieuXuatKho(ma_pt),
        enabled: !!ma_pt,
    });
};

export const useCreatePhieuXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: phieuXuatKhoApi.createPhieuXuatKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatkho"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdatePhieuXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => phieuXuatKhoApi.updatePhieuXuatKho(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatkho"] });
            queryClient.invalidateQueries({ queryKey: ["phieuxuatkho", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeletePhieuXuatKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: phieuXuatKhoApi.deletePhieuXuatKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatkho"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};