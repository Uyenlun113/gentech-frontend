import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, LoginPayload } from '../services/authService';
import { toast } from 'react-toastify';

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginPayload) => login(payload),
        onSuccess: (data) => {
            toast.success(data.message || 'Đăng nhập thành công');
            localStorage.setItem('access_token', data.access_token);
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            const resMsg = error?.response?.data?.message;
            const errMessage =
                Array.isArray(resMsg) ? resMsg.join(', ') :
                    typeof resMsg === 'string' ? resMsg :
                        'Đăng nhập thất bại';
            toast.error(errMessage);
        },
    });
};
