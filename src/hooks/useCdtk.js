import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import cdtkService from "../services/cdtk";


// ✅ Lấy danh sách theo năm
export const useListCdtk = (nam) => {
    return useQuery({
        queryKey: ["cdtk", nam],
        queryFn: () => cdtkService.getByYear(nam),
        enabled: !!nam, // chỉ chạy khi có `nam`
        staleTime: Infinity,
    });
};

// ✅ Thêm mới
export const useCreateCdtkBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (dataArray) => cdtkService.createBulk(dataArray),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cdtk"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm nhiều bản ghi");
        },
    });
};

// ✅ Cập nhật theo TK và năm
export const useUpdateCdtk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ tk, nam, data }) => cdtkService.updateByTkAndYear(tk, nam, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cdtk"] });
            toast.success("Cập nhật số dư đầu kỳ thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        },
    });
};

export const useFindCdtkByTkAndYear = (tk, nam) => {
    return useQuery({
        queryKey: ["cdtk", tk, nam],
        queryFn: () => cdtkService.findOne(tk, nam),
        enabled: !!tk && !!nam, 
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};