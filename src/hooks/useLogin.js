import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/authService";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload) => login(payload),
    onSuccess: async (data) => {
      toast.success(data.message || "Đăng nhập thành công");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_info", JSON.stringify(data.user));

      navigate("/", { replace: true });
    },
    onError: (error) => {
      const resMsg = error?.response?.data?.message;
      const errMessage = Array.isArray(resMsg)
        ? resMsg.join(", ")
        : typeof resMsg === "string"
        ? resMsg
        : "Đăng nhập thất bại";
      toast.error(errMessage);
    },
  });
};
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
    },
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      navigate("/signin", { replace: true });
    },
    onError: (error) => {
      const resMsg = error?.response?.data?.message;
      const errMessage = Array.isArray(resMsg)
        ? resMsg.join(", ")
        : typeof resMsg === "string"
        ? resMsg
        : "Đăng xuất thất bại";
      toast.error(errMessage);
    },
  });
};
