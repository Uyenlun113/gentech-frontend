import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customerGroupService from "../services/dmnhkh";


export const useCustomerGroups = (params = {}) => {
    return useQuery({
        queryKey: ["dmnhkh", params],
        queryFn: () => customerGroupService.getDmnhkh(params),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export const useCustomerGroup = (loai_nh, ma_kh) => {
    return useQuery({
        queryKey: ["dmnhkh", loai_nh, ma_kh],
        queryFn: () => customerGroupService.getCustomerGroupById(loai_nh, ma_kh),
        enabled: !!loai_nh && !!ma_kh,
    });
};

export const useCreateCustomerGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerGroupService.addDmnhkh,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmnhkh"] });
            toast.success("Thêm nhóm khách hàng thành công!");
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Có lỗi khi thêm nhóm khách hàng";
            toast.error(msg);
        },
    });
};

export const useUpdateCustomerGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ma_kh, loai_nh, data }) => customerGroupService.updateDmnhkh(ma_kh, loai_nh, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["dmnhkh"] });
            queryClient.invalidateQueries({
                queryKey: ["dmnhkh", variables.loai_nh, variables.ma_kh],
            });
            toast.success("Cập nhật nhóm khách hàng thành công!");
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Có lỗi khi cập nhật nhóm khách hàng";
            toast.error(msg);
        },
    });
};

export const useDeleteCustomerGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ma_kh, loai_nh }) => customerGroupService.deleteDmnhkh(ma_kh, loai_nh),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dmnhkh"] });
            toast.success("Xóa nhóm khách hàng thành công!");
        },
        onError: (error) => {
            const msg = error?.response?.data?.message || "Có lỗi khi xóa nhóm khách hàng";
            toast.error(msg);
        },
    });
};