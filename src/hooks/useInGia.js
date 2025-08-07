import { useMutation } from '@tanstack/react-query';
import inGiaApi from '../services/ingia';


export function usePostInGia() {
    return useMutation({
        mutationFn: async (payload) => {
            return await inGiaApi.postInGia(payload);
        },
    });
}