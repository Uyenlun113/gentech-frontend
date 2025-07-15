import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ct46Api from "../services/phieu-chi";


// Hook để lấy danh sách phiếu chi
export const useCt46List = (params = {}) => {
    return useQuery({
        queryKey: ["ct46-list", params],
        queryFn: () => ct46Api.getCt46List(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
};

// Hook để lấy chi tiết phiếu chi theo stt_rec
export const useCt46ById = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["ct46-detail", stt_rec],
        queryFn: () => ct46Api.getCt46ById(stt_rec),
        enabled: !!stt_rec,
        staleTime: 1000 * 60 * 5,
        retry: 2,
        ...options,
    });
};

// Hook để lấy dữ liệu CT46 (hạch toán)
export const useFetchCt46Data = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["ct46-data", stt_rec],
        queryFn: () => ct46Api.fetchCt46Data(stt_rec),
        enabled: !!stt_rec,
        staleTime: 1000 * 60 * 5,
        retry: 2,
        ...options,
    });
};

// Hook để tạo phiếu chi mới
export const useSaveCt46Accounting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => ct46Api.createCt46(payload),
        onSuccess: (data) => {
            toast.success("Tạo phiếu chi thành công!");
            queryClient.invalidateQueries({ queryKey: ["ct46-list"] });
            return data;
        },
        onError: (error) => {
            console.error("Error creating ct46:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi tạo phiếu chi";
            toast.error(errorMessage);
            throw error;
        },
    });
};

// Hook để cập nhật phiếu chi
export const useUpdateCt46Accounting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stt_rec, payload }) => ct46Api.updateCt46(stt_rec, payload),
        onSuccess: (data, variables) => {
            toast.success("Cập nhật phiếu chi thành công!");
            queryClient.invalidateQueries({ queryKey: ["ct46-list"] });
            queryClient.invalidateQueries({ queryKey: ["ct46-detail", variables.stt_rec] });
            queryClient.invalidateQueries({ queryKey: ["ct46-data", variables.stt_rec] });
            return data;
        },
        onError: (error) => {
            console.error("Error updating ct46:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi cập nhật phiếu chi";
            toast.error(errorMessage);
            throw error;
        },
    });
};

// Hook để xóa phiếu chi
export const useDeleteCt46Accounting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stt_rec) => ct46Api.deleteCt46(stt_rec),
        onSuccess: () => {
            toast.success("Xóa phiếu chi thành công!");
            queryClient.invalidateQueries({ queryKey: ["ct46-list"] });
        },
        onError: (error) => {
            console.error("Error deleting ct46:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi xóa phiếu chi";
            toast.error(errorMessage);
            throw error;
        },
    });
};