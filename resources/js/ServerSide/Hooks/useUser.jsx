import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    getUser,
    setLoading,
    setUsers,
    setRequest
}  from '../../Repo/Redux/Modules/UserSlice.jsx';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';


export const useUser = () => {
    const dispatch = useDispatch();

    const setUser = async (page = 1) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.USER.USER}?page=${page}`
            );

            // 🔥 SADECE GEREKLİ DATA
            dispatch(setUsers(response.data.data));

            return response.data.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const get_user = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.USER.USER}/${id}`
            );

            dispatch(getUser(response.data.data));
            return response.data.data;

        } catch (error) {
            toast.error("Kullanıcı Yüklenemedi.");
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteUsers = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.USER.USER}/${id}`);

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };
    const requestAdmin = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.USER.ADMINREQUEST); // 💥 Doğru endpoint burası

            toast.success("Admin olma isteğiniz gönderildi! ✅");
            return response.data;
        } catch (error) {
            toast.error("İstek gönderilemedi! ❌");
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const setrequestAdmin = async () => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(API_CONFIG.ENDPOINTS.USER.ADMINREQUEST);
            console.log("admin request gelen response:", response.data); // 👈 ekle

            dispatch(setRequest(response.data)); // doğrudan dizi gönder
            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const approveAdminRequest = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.USER.ADMINREQUESTAPPROVE}/${id}`);

            toast.success("Admin onayı verildi ✅");
            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Onaylama işlemi başarısız ❌'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const rejectAdminRequest = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.USER.ADMINREQUESTREJECT}/${id}`);

            toast.success("Admin isteği reddedildi ❌");
            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Reddetme işlemi başarısız ❌'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    const createUser = async (user) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.USER.USER, user, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        }catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const updateUser = async (user,id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.USER.USER_UPDATE}/${id}`, user);

            return response.data;

        }catch (error) {
            dispatch(setError(error.message));
            toast.error('Müşteri Düzenlenemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }




    const updateMeUser = async (user) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.put(API_CONFIG.ENDPOINTS.USER.ME, user);

            return response.data;

        }catch (error) {
            dispatch(setError(error.message));
            toast.error('Müşteri Düzenlenemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }

    const updatePassword = async (user) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.put(API_CONFIG.ENDPOINTS.USER.RESETPASSWORD, user);

            return response.data;

        }catch (error) {
            dispatch(setError(error.message));
            toast.error('Müşteri Düzenlenemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }

    return {
        setUsers: setUser,
        deleteUsers: deleteUsers,
        createUser: createUser,
        updateUser: updateUser,
        updateMeUser: updateMeUser,
        updatePassword: updatePassword,
        getUser: get_user,
        requestAdmin: requestAdmin,
        setRequest :setrequestAdmin,
        approveAdminRequest: approveAdminRequest,
        rejectAdminRequest: rejectAdminRequest,
    };
};
