import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import phieuNhapKhoApi from "../services/phieunhapkho";

export const usePhieuNhapKhos = (params) => {
    return useQuery({
        queryKey: ["phieunhapkho", params],
        queryFn: () => phieuNhapKhoApi.getPhieuNhapKhos(params),
        staleTime: Infinity,
    });
};

export const usePhieuNhapKho = (ma_pt) => {
    return useQuery({
        queryKey: ["phieunhapkho", ma_pt],
        queryFn: () => phieuNhapKhoApi.getPhieuNhapKho(ma_pt),
        enabled: !!ma_pt,
    });
};

export const useCreatePhieuNhapKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: phieuNhapKhoApi.createPhieuNhapKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieunhapkho"] });
            toast.success("Tạo giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo giấy");
        },
    });
};

export const useUpdatePhieuNhapKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, data }) => phieuNhapKhoApi.updatePhieuNhapKho(stt_rec, data),
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["phieunhapkho"] });
            queryClient.invalidateQueries({ queryKey: ["phieunhapkho", variables.stt_rec] });
            toast.success("Cập nhật giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật giấy");
        },
    });
};

export const useDeletePhieuNhapKho = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: phieuNhapKhoApi.deletePhieuNhapKho,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieunhapkho"] });
            toast.success("Xóa giấy thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa giấy");
        },
    });
};