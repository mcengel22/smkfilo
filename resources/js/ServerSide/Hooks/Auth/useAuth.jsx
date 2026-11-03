import {useDispatch, useSelector} from 'react-redux';
import {
    setCredentials,
    logout,
    setError,
    setLoading,
    setAuthChecked
} from '../../../Repo/Redux/Auth/AuthSlice';
import { AuthService } from '../../Load';
import {toast} from "react-toastify";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { token, isAuthChecked } = useSelector(state => state.auth);

    const handleLogin = async (credentials) => {
        try {
            dispatch(setLoading(true));

            const response = await AuthService.login(credentials);

            dispatch(setCredentials({
                token: response.data.token,
                user: response.data.user
            }));

            localStorage.setItem('token', response.data.token);

            return response;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message); // Kullanıcıya uyarı göster
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    const handleRegister = async (userData) => {
        try {
            dispatch(setLoading(true));

            const response = await AuthService.register(userData);

            // Eğer register sonrası otomatik login yapılacaksa
            if (response.data.token) {
                dispatch(setCredentials({
                    token: response.data.token,
                    user: response.data.user
                }));

                localStorage.setItem('token', response.data.token);
            }

            return response;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message); // Hata durumunda toast bas
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Çıkış hatası:', error);
        } finally {
            localStorage.removeItem('token');
            dispatch(logout());
        }
    };

    const checkAuth = async () => {
        return new Promise(async (resolve, reject) => {
            const token = localStorage.getItem('token');

            if (!token) {
                dispatch(setAuthChecked());
                resolve(false);
                return;
            }

            if (isAuthChecked && token) {
                resolve(true);
                return;
            }


            try {
                const response = await AuthService.me();

                dispatch(setCredentials({
                    token,
                    user: response.data
                }));

                resolve(true);
            } catch (error) {
                console.error('Auth kontrolü hatası:', error);
                localStorage.removeItem('token');
                dispatch(setAuthChecked());
                resolve(false);
            }
        });
    };


    return {
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        checkAuth: checkAuth
    };
};
