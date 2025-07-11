import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import generalLedgerApi from "../services/generalLedger";

export const useSaveGeneralAccounting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await generalLedgerApi.createGeneralLedger(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generalAccounting"] });
      toast.success("Lập phiếu kế toán thành công!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lập phiếu kế toán");
    },
  });
};

export const useUpdateGeneralAccounting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stt_rec, payload }) => {
      return await generalLedgerApi.updateGeneralLedger(stt_rec, payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["generalAccounting"] });
      queryClient.invalidateQueries({ queryKey: ["generalAccounting", variables.stt_rec] });
      queryClient.invalidateQueries({ queryKey: ["ct11Data", variables.stt_rec] });
      toast.success("Cập nhật phiếu kế toán thành công!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật phiếu kế toán");
    },
  });
};

export const useDeleteGeneralAccounting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stt_rec) => {
      return await generalLedgerApi.deleteGeneralLedger(stt_rec);
    },
    onSuccess: (data, stt_rec) => {
      queryClient.invalidateQueries({ queryKey: ["generalAccounting"] });
      queryClient.removeQueries({ queryKey: ["generalAccounting", stt_rec] });
      queryClient.removeQueries({ queryKey: ["ct11Data", stt_rec] });
    },
  });
};

export const useGetGeneralAccounting = (params) => {
  return useQuery({
    queryKey: ["generalAccounting", params],
    queryFn: async () => {
      return await generalLedgerApi.getGeneralLedger(params);
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useGetGeneralAccountingById = (stt_rec) => {
  return useQuery({
    queryKey: ["generalAccounting", stt_rec],
    queryFn: async () => {
      return await generalLedgerApi.getGeneralLedgerById(stt_rec);
    },
    enabled: !!stt_rec,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};

export const useFetchCt11Data = (stt_rec, options) => {
  return useQuery({
    queryKey: ["ct11Data", stt_rec],
    queryFn: async () => {
      if (!stt_rec) {
        throw new Error("stt_rec is required");
      }
      return await generalLedgerApi.fetchCt11Data(stt_rec);
    },
    enabled: !!stt_rec && options?.enabled !== false,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};
