import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import hdBanDvService from "../services/hd-ban-dv";


export const useListHdBanDv = (params = {}) => {
    return useQuery({
        queryKey: ["hd-ban-dv", params],
        queryFn: ({ signal }) => hdBanDvService.getHdBanDvs(params, { signal }),
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
                console.error('Error fetching hd ban dv list:', error);
            }
        }
    });
};

export const useGetHdBanDvBySttRec = (stt_rec, options = {}) => {
    return useQuery({
        queryKey: ["hd-ban-dv", stt_rec],
        queryFn: ({ signal }) => hdBanDvService.getHdBanDvById(stt_rec, { signal }),
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
                console.error('Error fetching hd ban dv detail:', error);
            }
        }
    });
};

export const useCreateOrUpdateHdBanDv = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => hdBanDvService.createHdBanDv(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hd-ban-dv"] });
        },
        onError: (error) => {
            console.error('Error creating hd ban dv:', error);
        }
    });
};

export const useUpdateHdBanDv = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ stt_rec, data }) => hdBanDvService.updateHdBanDv(stt_rec, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["hd-ban-dv"] });
            queryClient.setQueryData(["hd-ban-dv", variables.stt_rec], data);
        },
        onError: (error) => {
            console.error('Error updating hd ban dv:', error);
        }
    });
};

export const useDeleteHdBanDv = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (stt_rec) => hdBanDvService.deleteHdBanDv(stt_rec),
        onSuccess: (data, stt_rec) => {
            queryClient.invalidateQueries({ queryKey: ["hd-ban-dv"] });
            queryClient.removeQueries({ queryKey: ["hd-ban-dv", stt_rec] });
        },
        onError: (error) => {
            console.error('Error deleting hd ban dv:', error);
        }
    });
};
