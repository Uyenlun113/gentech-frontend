import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import materialGroupService from "../services/category/material-group";

export const useMaterialGroups = (params = {}) => {
  return useQuery({
    queryKey: ["dmnhvt", params],
    queryFn: () => materialGroupService.getMaterialGroups(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useMaterialGroup = (loai_nh, ma_nh) => {
  return useQuery({
    queryKey: ["dmnhvt", loai_nh, ma_nh],
    queryFn: () => materialGroupService.getMaterialGroupById(loai_nh, ma_nh),
    enabled: !!loai_nh && !!ma_nh,
  });
};

export const useCreateMaterialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialGroupService.addMaterialGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dmnhvt"] });
      toast.success("Thêm nhóm vật tư thành công!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Có lỗi khi thêm nhóm vật tư";
      toast.error(msg);
    },
  });
};

export const useUpdateMaterialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loai_nh, ma_nh, data }) => materialGroupService.updateMaterialGroup(loai_nh, ma_nh, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dmnhvt"] });
      queryClient.invalidateQueries({
        queryKey: ["dmnhvt", variables.loai_nh, variables.ma_nh],
      });
      toast.success("Cập nhật nhóm vật tư thành công!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Có lỗi khi cập nhật nhóm vật tư";
      toast.error(msg);
    },
  });
};

export const useDeleteMaterialGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loai_nh, ma_nh }) => materialGroupService.deleteMaterialGroup(loai_nh, ma_nh),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dmnhvt"] });
      toast.success("Xóa nhóm vật tư thành công!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Có lỗi khi xóa nhóm vật tư";
      toast.error(msg);
    },
  });
};
