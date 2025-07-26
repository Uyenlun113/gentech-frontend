import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import donBanHangService from "../services/donBanHangService";

export const useListDonBanHang = (params = {}) => {
    return useQuery({
        queryKey: ["don-ban-hang", params],
        queryFn: ({ signal }) => donBanHangService.getDonBanHangs(params, { signal }),
        staleTime: 5 * 60 * 1000, // 5 phút
        cacheTime: 10 * 60 * 1000, // 10 phút
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
                return false;
            }
            return failureCount < 3;
        },
        onError: (error) => {
            if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
                console.error('Error fetching don ban hang list:', error);
            }
        }
    });
};

export const useGetDonBanHangBySttRec = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["don-ban-hang", stt_rec],
        queryFn: ({ signal }) => donBanHangService.getDonBanHangById(stt_rec, { signal }),
        enabled: !!stt_rec && options.enabled !== false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
                return false;
            }
            return failureCount < 3;
        },
        onError: (error) => {
            if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
                console.error('Error fetching don ban hang detail:', error);
            }
        }
    });
};

export const useCreateOrUpdatePhieu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => donBanHangService.createDonBanHang(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["don-ban-hang"] });
        },
        onError: (error) => {
            console.error('Error creating don ban hang:', error);
        }
    });
};

export const useUpdatePhieu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ stt_rec, data }) => donBanHangService.updateDonBanHang(stt_rec, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["don-ban-hang"] });
            queryClient.setQueryData(["don-ban-hang", variables.stt_rec], data);
        },
        onError: (error) => {
            console.error('Error updating don ban hang:', error);
        }
    });
};

export const useDeletePhieu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (stt_rec) => donBanHangService.deleteDonBanHang(stt_rec),
        onSuccess: (data, stt_rec) => {
            queryClient.invalidateQueries({ queryKey: ["don-ban-hang"] });
            queryClient.removeQueries({ queryKey: ["don-ban-hang", stt_rec] });
        },
        onError: (error) => {
            console.error('Error deleting don ban hang:', error);
        }
    });
};