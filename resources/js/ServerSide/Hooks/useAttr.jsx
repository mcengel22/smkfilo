import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setCategories,
    setFeatures,
    setRules,
    setOperations,
    setNears,
} from '../../Repo/Redux/Modules/AttrSlice';
import { apiService } from '../Load';
import { API_CONFIG } from "../EndPoints";
import {toast} from "react-toastify";
import {t} from "i18next";
import {getUser, setUsers} from "@/Repo/Redux/Modules/UserSlice.jsx";

export const useAttr = () => {
    const dispatch = useDispatch();

    const setCategory = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.CATEGORY);

            // Sadece data kısmını dispatch et
            dispatch(setCategories(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    const setFeature = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.FEATURES);

            // Sadece data kısmını dispatch et
            dispatch(setFeatures(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İlan Özellikleri Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const setRule = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.RULES);

            // Sadece data kısmını dispatch et
            dispatch(setRules(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İlan Kuralları Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const setOperation = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.OPERATION);

            // Sadece data kısmını dispatch et
            dispatch(setOperations(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Operasyon Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const setNear = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.NEAR);

            // Sadece data kısmını dispatch et
            dispatch(setNears(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İlan Yakındakileri Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getAttrwType = async (post_type,attr_type) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ATTR.GET_W_TYPE}/${post_type}/${attr_type}`);
            return response.data;
        }catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İlan Yakındakileri Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
    const createAttr = async (attr) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.ATTR.ATTR, attr, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t('İşlem Başarılı'));

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

    const get_attr = async (slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ATTR.ATTR}/${slug}`);

            dispatch(getUser(response.data));
            return response.data;
        }catch (error) {
            toast.error("Attr Yüklenemedi.");
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }
    const setAttr = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.ATTR.ATTR);

            // Sadece data kısmını dispatch et
            dispatch(setAttrs(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
    const updateAttr = async (slug, attr) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.ATTR.ATTR}/${slug}`, attr, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t('İşlem Başarılı'));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));

            if (error.response?.status === 422) {
                console.error("Validasyon hatası:", error.response.data.errors);
                toast.error("Zorunlu alanları kontrol et.");
            } else {
                toast.error("Attr düzenlenemedi.");
            }

            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    const deleteAttr = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.ATTR.ATTR}/${id}`);
            toast.success(t('İşlem Başarılı'));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };

    const fetchAttrwSlug = async (slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ATTR.ATTR}/${slug}`);


            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İlan Yakındakileri Yüklenemedi'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
    return {
        setCategories: setCategory,
        setFeatures: setFeature,
        setRules: setRule,
        setOperations: setOperation,
        setNears: setNear,
        setAttr: setAttr,
        fetchAttrwSlug: fetchAttrwSlug,
        getAttrwType: getAttrwType,
        createAttr:createAttr,
        deleteAttr:deleteAttr,
        getAttr:get_attr,
        updateAttr:updateAttr,
    };
};
