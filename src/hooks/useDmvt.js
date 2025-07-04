import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import dmvtService from "../services/dmvt";

export const useDmvt = (params = {}) => {
    return useQuery({
        queryKey: ["dmvt", params],
        queryFn: () => dmvtService.getDmvt(params),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export const useDmvtById = (ma_vt) => {
    return useQuery({
        queryKey: ["dmvt", ma_vt],
        queryFn: () => dmvtService.getDmvtById(ma_vt),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};


export const useCreateDmvt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => dmvtService.addDmvt(data), // data từ mutateAsync
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmvt"] });
            toast.success("Tạo danh mục vật tư thành công!");
        },
        onError: (error) => {
            console.log("Full error:", error.response?.data); // Debug error
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục vật tư");
        }
    });
}

export const useUpdateDmvt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ma_vt, data }) => dmvtService.updateDmvt(ma_vt, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmvt"] });
            toast.success("Cập nhật danh mục vật tư thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục vật tư");
        }
    });
};

export const useDeleteDmvt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ma_vt) => dmvtService.deleteDmvt(ma_vt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmvt"] });
            toast.success("Xóa danh mục vật tư thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa danh mục vật tư");
        }
    });
}