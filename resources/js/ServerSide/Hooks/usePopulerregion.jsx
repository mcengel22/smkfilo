import { useDispatch } from "react-redux";
import {
    setError,
    setLoading,
    setPopulerregions,
} from "../../Repo/Redux/Modules/PopulerregionSlice";
import { API_CONFIG } from "../EndPoints";
import { t } from "i18next";
import { apiService } from "../Load";

/**
 * ✅ Popüler Bölgeler Hook (Laravel uyumlu)
 *
 * GET    /api/v1/populerregions        → Tüm kayıtlar
 * POST   /api/v1/populerregions        → Yeni kayıt oluştur
 * GET    /api/v1/populerregions/{id}   → Tekil veri
 * PUT    /api/v1/populerregions/{id}   → Güncelle
 * DELETE /api/v1/populerregions/{id}   → Sil
 */
export const usePopulerregion = () => {
    const dispatch = useDispatch();

    /** 🔹 Listeleme */
    const setPopulerregion = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.POPULERREGION.POPULERREGION
            );

            const data = response.data?.data || [];
            dispatch(setPopulerregions(data));
            return data;
        } catch (error) {
            dispatch(setError(error.message));

            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    /** 🔹 Ekleme (POST) */
    const createPopulerregion = async (formData) => {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.POPULERREGION.POPULERREGION,
                formData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /** 🔹 Tekil veri (GET /id) */
    const getPopulerregion = async (id) => {
        try {
            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.POPULERREGION.POPULERREGION}/${id}`
            );
            return response.data?.data;
        } catch (error) {

            throw error;
        }
    };

    /** 🔹 Güncelleme (PUT) */
    const updatePopulerregion = async (id, formData) => {
        try {
            const response = await apiService.put(
                `${API_CONFIG.ENDPOINTS.POPULERREGION.POPULERREGION}/${id}`,
                formData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /** 🔹 Silme (DELETE) */
    const deletePopulerregion = async (id) => {
        try {
            await apiService.delete(
                `${API_CONFIG.ENDPOINTS.POPULERREGION.POPULERREGION}/${id}`
            );

        } catch (error) {
            throw error;
        }
    };

    return {
        setPopulerregions: setPopulerregion,
        createPopulerregion,
        getPopulerregion,
        updatePopulerregion,
        deletePopulerregion,
    };
};
