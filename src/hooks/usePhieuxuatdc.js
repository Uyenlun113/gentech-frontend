import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import phieuXuatDcService from "../services/phieuxuatdc";

export const useCreatePhieuXuatDc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => phieuXuatDcService.createPhieuXuatDc(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatdc"] });
            toast.success("Phiếu xuất DC đã được tạo thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu xuất DC");
        },
    });
}
export const useGetPhieuXuatDc = (stt_rec) => {
    return useQueryClient({
        queryKey: ["phieuxuat", stt_rec],
        queryFn: () => phieuXuatDcService.getPhieuXuatDc(stt_rec),
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lấy phiếu xuất DC");
        },
    });
}
export const useGetAllPhieuXuatDc = (params = {}) => {
    return useQuery({
        queryKey: ["phieuxuatdc", params],
        queryFn: () => phieuXuatDcService.getAllPhieuXuatDc(params),
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        onError: (error) => {
            console.error("Error fetching phieu xuat dc:", error);
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lấy danh sách phiếu xuất DC");
        },
    });
};

export const useUpdatePhieuXuatDc = (stt_rec) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => phieuXuatDcService.updatePhieuXuatDc(stt_rec, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatdc"] });
            toast.success("Phiếu xuất DC đã được cập nhật thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật phiếu xuất DC");
        },
    });
}
export const useDeletePhieuXuatDc = (stt_rec) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => phieuXuatDcService.deletePhieuXuatDc(stt_rec),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["phieuxuatdc"] });
            toast.success("Phiếu xuất DC đã được xóa thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa phiếu xuất DC");
        },
    });
}