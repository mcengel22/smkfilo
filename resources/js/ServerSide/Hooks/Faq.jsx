import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setFaqs
}  from '../../Repo/Redux/Modules/FaqSlice';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';


export const useFaq = () => {
    const dispatch = useDispatch();

    const setFaq = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.FAQ.FAQ);

            // Sadece data kısmını dispatch et
            dispatch(setFaqs(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        setFaqs: setFaq
    };
};
