import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { API_CONFIG } from "../EndPoints";
import { apiService } from "../Load";

// Laravel doğrulama hatasından ilk mesajı çıkarır
const errorMessage = (error, fallback) => {
    const errors = error?.response?.data?.errors;
    if (errors) {
        const first = Object.values(errors)[0];
        return Array.isArray(first) ? first[0] : first;
    }
    return error?.response?.data?.message || fallback;
};

export const useReference = () => {
    const [references, setReferences] = useState([]);
    const [loading, setLoading] = useState(false);

    // admin = true: panel için pasifler dahil tüm kayıtlar
    const fetchReferences = useCallback(async (admin = false) => {
        try {
            setLoading(true);
            const url = admin
                ? API_CONFIG.ENDPOINTS.REFERENCE.ADMIN
                : API_CONFIG.ENDPOINTS.REFERENCE.REFERENCE;
            const response = await apiService.get(url);
            setReferences(response?.data?.data || []);
            return response?.data?.data;
        } catch (error) {
            if (admin) toast.error("Referanslar yüklenemedi.");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const saveReference = async (formData, id = null) => {
        const url = id
            ? `${API_CONFIG.ENDPOINTS.REFERENCE.REFERENCE}/${id}`
            : API_CONFIG.ENDPOINTS.REFERENCE.REFERENCE;
        try {
            const response = await apiService.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(id ? "Referans güncellendi." : "Referans eklendi.");
            return response?.data?.data;
        } catch (error) {
            toast.error(errorMessage(error, "Referans kaydedilemedi."));
            throw error;
        }
    };

    const deleteReference = async (id) => {
        try {
            await apiService.delete(`${API_CONFIG.ENDPOINTS.REFERENCE.REFERENCE}/${id}`);
            toast.success("Referans silindi.");
        } catch (error) {
            toast.error(errorMessage(error, "Referans silinemedi."));
            throw error;
        }
    };

    return { references, loading, fetchReferences, saveReference, deleteReference };
};
