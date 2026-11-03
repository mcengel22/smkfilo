import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setFavorites,
}  from '../../Repo/Redux/Modules/FavoriteSlice';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';


export const useFavorite = () => {
    const dispatch = useDispatch();

    const setFavorite = async () => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(API_CONFIG.ENDPOINTS.FAVORITE.FAVORITE);
            dispatch(setFavorites(response.data));
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Favoriler yüklenemedi.'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const processFavorite = async (favorite) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.FAVORITE.FAVORITEPROCESS, favorite);

            // Başarılı mesajını gösterelim:
            // // const message = response?.message || (response?.data?.message ?? "İşlem tamamlandı.");
            // toast.success(t(message));

            // Favori listesini güncelle
            await setFavorite();

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Favori işlemi başarısız oldu.'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        setFavorite,
        processFavorite,
    };
};

