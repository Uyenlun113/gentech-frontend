import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import baocaoMuaHangService from "../services/baocaomuahang";

const usePostBCMuaHang = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => baocaoMuaHangService.getData(payload),
        onSuccess: () => {
            // toast.success("Gửi báo cáo thành công!");
            // Nếu cần refetch dữ liệu liên quan
            queryClient.invalidateQueries(["baocaoKho"]);
        },
        onError: () => {
            toast.error("Có lỗi khi gửi báo cáo!");
        },
    });
}
export default usePostBCMuaHang;