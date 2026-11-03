import { useDispatch } from "react-redux";
import {
    setPolicies,
    setLoading,
    setError,
} from "../../Repo/Redux/Modules/PoliciesSlice";
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from "../Load";

/**
 * ✅ Policies Hook (Laravel uyumlu)
 *
 * GET    /api/policies           → Tüm kayıtlar
 * POST   /api/policies           → Yeni kayıt oluştur
 * GET    /api/policies/{idOrType}→ Tekil veri
 * PUT    /api/policies/{id}      → Güncelle
 * DELETE /api/policies/{id}      → Sil
 */
export const usePolicies = () => {
    const dispatch = useDispatch();

    /** 🔹 Listeleme */
    const getPolicies = async () => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(API_CONFIG.ENDPOINTS.POLICIES.POLICIES);
            const data = response.data?.data || [];
            dispatch(setPolicies(data));
            return data;
        } catch (error) {
            console.error("Politikalar yüklenemedi:", error);
            dispatch(setError(error.message));
            toast.error(t("Politikalar yüklenemedi"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    /** 🔹 Tekil veri */
    const getPolicy = async (idOrType) => {
        try {
            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.POLICIES.POLICIES}/${idOrType}`
            );
            return response.data?.data;
        } catch (error) {
            console.error("Politika getirilemedi:", error);
            toast.error(t("Politika bulunamadı"));
            throw error;
        }
    };

    /** 🔹 Ekleme */
    const createPolicy = async (formData) => {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.POLICIES.POLICIES,
                formData
            );
            toast.success(t("Politika eklendi"));
            return response.data;
        } catch (error) {
            console.error("Politika eklenemedi:", error);
            toast.error(t("Ekleme başarısız"));
            throw error;
        }
    };

    /** 🔹 Güncelleme */
    const updatePolicy = async (id, formData) => {
        try {
            const response = await apiService.put(
                `${API_CONFIG.ENDPOINTS.POLICIES.POLICIES}/${id}`,
                formData
            );
            toast.success(t("Politika güncellendi"));
            return response.data;
        } catch (error) {
            console.error("Politika güncellenemedi:", error);
            toast.error(t("Güncelleme başarısız"));
            throw error;
        }
    };

    /** 🔹 Silme */
    const deletePolicy = async (id) => {
        try {
            await apiService.delete(
                `${API_CONFIG.ENDPOINTS.POLICIES.POLICIES}/${id}`
            );
            toast.success(t("Politika silindi"));
        } catch (error) {
            console.error("Politika silinemedi:", error);
            toast.error(t("Silme işlemi başarısız"));
            throw error;
        }
    };

    return {
        getPolicies,
        getPolicy,
        createPolicy,
        updatePolicy,
        deletePolicy,
    };
};
