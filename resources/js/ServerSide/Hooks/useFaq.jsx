import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
    setError,
    setLoading,
    setFaqs,
    getFaq as setSingleFaq,
} from "@/Repo/Redux/Modules/FaqSlice";
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import axios from "axios";

/**
 * ✅ Laravel uyumlu FAQ (SSS) HOOK
 *
 *  GET    /api/v1/faq               → index()
 *  GET    /api/v1/faq/{id}          → show()
 *  POST   /api/v1/faq               → store()
 *  PUT    /api/v1/faq/{id}          → update()
 *  DELETE /api/v1/faq/{id}          → destroy()
 */
export const useFaq = () => {
    const dispatch = useDispatch();

    /** 🔧 URL Builder (sabit referanslı) */
    const buildUrl = useCallback((endpoint = "") => {
        const base =
            API_CONFIG?.BASE_URL;
        const cleanBase = base.replace(/\/$/, "");
        const cleanEp = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        return `${cleanBase}${cleanEp}`;
    }, []);

    /** 🔹 SSS Listeleme (paginate + search) */
    const setFaqsFunc = useCallback(
        async (filters = {}) => {
            try {
                dispatch(setLoading(true));

                const page = filters.pagination?.pageNumber ?? 1;
                const perPage = filters.pagination?.perPage ?? 10;
                const sortBy = filters.sort?.by ?? "id";
                const sortDir = filters.sort?.direction ?? "desc";
                const search = filters.search ?? "";

                const url = buildUrl(
                    `${API_CONFIG?.ENDPOINTS?.FAQ?.BASE || "/api/v1/faq"}?page=${page}&per_page=${perPage}&sort=${sortBy}&direction=${sortDir}&search=${encodeURIComponent(search)}`
                );

                const response = await axios.get(url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const payload = {
                    faqs: response.data.data || [],
                    pagination: response.data.pagination || null,
                };

                dispatch(setFaqs(payload));
                return payload;
            } catch (error) {
                console.error("❌ SSS listesi alınamadı:", error);
                dispatch(setError(error.message));
                toast.error(t("SSS listesi alınamadı."));
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, buildUrl]
    );

    /** 🔹 Tekil SSS Getir (id bazlı) */
    const getFaq = useCallback(
        async (id) => {
            try {
                if (!id) throw new Error("ID gerekli");
                dispatch(setLoading(true));

                const baseEp = API_CONFIG?.ENDPOINTS?.FAQ?.BASE || "/api/v1/faq";
                const url = buildUrl(`${baseEp}/${id}`);

                const response = await axios.get(url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = response.data.data || response.data;
                dispatch(setSingleFaq(data));
                return data;
            } catch (error) {
                console.error("❌ Tekil SSS yüklenemedi:", error);
                dispatch(setError(error.message));
                toast.error(t("SSS yüklenemedi."));
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, buildUrl]
    );

    /** 🔹 SSS Oluştur */
    const createFaq = useCallback(
        async (formData) => {
            try {
                dispatch(setLoading(true));

                const url =
                    buildUrl(API_CONFIG?.ENDPOINTS?.FAQ?.BASE || "/api/v1/faq");

                const response = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    transformRequest: [(data) => data],
                });

                toast.success(t("SSS başarıyla oluşturuldu."));
                return response.data;
            } catch (error) {
                console.error("❌ SSS oluşturma hatası:", error);
                dispatch(setError(error.message));
                toast.error(t("SSS kaydı oluşturulamadı."));
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, buildUrl]
    );

    /** 🔹 SSS Güncelle */
    const updateFaq = useCallback(
        async (id, formData) => {
            try {
                if (!id) throw new Error("ID gerekli");
                dispatch(setLoading(true));

                const baseEp = API_CONFIG?.ENDPOINTS?.FAQ?.BASE || "/api/v1/faq";
                const url = buildUrl(`${baseEp}/${id}`);

                const response = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: { _method: "PUT" },
                    transformRequest: [(data) => data],
                });

                toast.success(t("SSS başarıyla güncellendi."));
                return response.data;
            } catch (error) {
                console.error("❌ SSS güncelleme hatası:", error);
                dispatch(setError(error.message));
                toast.error(t("SSS güncellenemedi."));
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, buildUrl]
    );

    /** 🔹 SSS Sil */
    const deleteFaq = useCallback(
        async (id) => {
            try {
                if (!id) throw new Error("ID gerekli");
                dispatch(setLoading(true));

                const baseEp = API_CONFIG?.ENDPOINTS?.FAQ?.BASE || "/api/v1/faq";
                const url = buildUrl(`${baseEp}/${id}`);

                await axios.delete(url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                toast.success(t("SSS kaydı başarıyla silindi."));
            } catch (error) {
                console.error("❌ SSS silme hatası:", error);
                dispatch(setError(error.message));
                toast.error(t("SSS kaydı silinemedi."));
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch, buildUrl]
    );

    /** 🧩 Return all (sabit referanslı fonksiyonlar) */
    return {
        setFaqs: setFaqsFunc,
        getFaq,
        createFaq,
        updateFaq,
        deleteFaq,
    };
};
