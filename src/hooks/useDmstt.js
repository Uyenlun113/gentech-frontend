import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import dmsttService from "../services/dmstt";

export const useListDmstt = () => {
    return useQuery({
        queryKey: ["dmstt"],
        queryFn: () => dmsttService.getDmstt(),
        staleTime: Infinity,
    });
}

export const useUpdateDmstt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ stt_rec, data }) => dmsttService.updateDmstt(stt_rec, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmstt"] });
            toast.success("Mở sổ đầu kỳ thành công!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật danh mục");
        }
    });
}