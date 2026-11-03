import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setCoupons
}  from '../../Repo/Redux/Modules/CouponSlice.jsx';
import { API_CONFIG } from "../EndPoints";
import { t } from "i18next";
import { apiService } from '../Load';


export const useCoupon = () => {
    const dispatch = useDispatch();

    const setCoupon = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.COUPON.COUPON);
            // Sadece data kısmını dispatch et
            dispatch(setCoupons(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getCoupon = async (id) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.COUPON.COUPON}/${id}`);
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateCoupon = async (id, data) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.COUPON.COUPON}/${id}`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createCoupon = async (coupon) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.COUPON.COUPON, coupon, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            return response.data;
        }catch (error) {
            dispatch(setError(error.message));

            throw error;
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const deleteCoupon = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.COUPON.COUPON}/${id}`);


            return response.data;
        } catch (error) {
            dispatch(setError(error.message));

            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };

    const validateCoupon = async ({ code, postId, orderTotal, userId }) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.post(API_CONFIG.ENDPOINTS.COUPON.VALIDATE, {
                code,
                post_id: postId,
                order_total: orderTotal,
                user_id: userId,
            });
            return response.data?.data; // { coupon, discountAmount }
        } catch (error) {
            dispatch(setError(error.message));
            const msg = error.response?.data?.message || t('Kupon doğrulanamadı');

            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        setCoupon,
        getCoupon,
        updateCoupon,
        createCoupon,
        deleteCoupon,
        validateCoupon,
    };
};
