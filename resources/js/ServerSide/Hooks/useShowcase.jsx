import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setShowcases
} from '../../Repo/Redux/Modules/ShowcaseSlice';
import {API_CONFIG} from "../EndPoints";
import {toast} from "react-toastify";
import {t} from "i18next";
import {apiService} from '../Load';


export const useShowcase = () => {
    const dispatch = useDispatch();

    const setShowcase = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASE);

            dispatch(setShowcases(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getShowcase = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASE}/${id}`);

            dispatch(setShowcases(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createShowcase = async (showcase) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASE, showcase, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const createShowcaseHasPosts = async (showcases,id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASESHASPOST}/${id}`, showcases);

            return response.data;

        }catch (error) {
            dispatch(setError(error.message));
            toast.error('Vitrin Düzenlenemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }

    const deleteShowcase = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASE}/${id}`);

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };

    const deleteShowcaseHasPost = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.SHOWCASE.SHOWCASESHASPOST}/${id}`);

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };
    return {
        setShowcases: setShowcase,
        getShowcase: getShowcase,
        createShowcases: createShowcase,
        createShowcaseHasPosts: createShowcaseHasPosts,
        deleteShowcases: deleteShowcase,
        deleteShowcaseHasPost: deleteShowcaseHasPost,
    };
};
