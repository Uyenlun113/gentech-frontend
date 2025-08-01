// useDmkho.js - SỬA TOÀN BỘ
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DmkhoService from "../services/dmkho";

export const useDmkho = (params) => {
    return useQuery({
        queryKey: ["dmkho", params],
        queryFn: () => DmkhoService.getDmkho(params),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useDmkhoById = (ma_kho) => {
    return useQuery({
        queryKey: ["dmkho", ma_kho],
        queryFn: () => DmkhoService.getDmkhoById(ma_kho),
        enabled: !!ma_kho,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

export const useCreateDmkho = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            return DmkhoService.addDmkho(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmkho"] });
            toast.success("Tạo danh mục kho thành công!");
        },
        onError: (error) => {
            console.error("Lỗi:", error.response?.data);
        }
    });
};

export const useUpdateDmkho = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ma_kho, data }) => {
            return DmkhoService.updateDmkho(ma_kho, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmkho"] });
            toast.success("Cập nhật danh mục kho thành công!");
        },
        onError: (error) => {
            console.log("Lỗi:", error.response?.data);
        }
    });
};

export const useDeleteDmkho = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ma_kho) => {
            return DmkhoService.deleteDmkho(ma_kho);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmkho"] });
            toast.success("Xóa danh mục kho thành công!");
        },
        onError: (error) => {
            console.log("Lỗi:", error.response?.data);
        }
    });
};