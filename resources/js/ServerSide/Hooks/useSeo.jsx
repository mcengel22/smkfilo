import { useDispatch } from "react-redux";
import {
    setError,
    setLoading,
    setSeos,
    getSeo as setSingleSeo,
} from "../../Repo/Redux/Modules/SeoSlice";
import { API_CONFIG } from "../EndPoints";
import axios from "axios";

/**
 * useSeo Hook
 *
 * @param {boolean} isFrontend - true = sadece frontend sayfalarında (Redux tetiklemez)
 */
export const useSeo = (isFrontend = false) => {
    const dispatch = useDispatch();

    // URL birleştirici
    const buildUrl = (endpoint) => {
        const base =
            API_CONFIG?.BASE_URL;

        return `${base.replace(/\/$/, "")}${
            endpoint.startsWith("/") ? "" : "/"
        }${endpoint}`;
    };

    // dispatch güvenli çağırıcı
    const safeDispatch = (fn) => {
        if (!isFrontend && typeof fn === "function") fn();
    };

    // Tekil SEO getir
    const getSeo = async (id) => {
        try {
            safeDispatch(() => dispatch(setLoading(true)));

            const url = buildUrl(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`);

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = response.data.data || response.data;
            safeDispatch(() => dispatch(setSingleSeo(data)));

            return data;
        } catch (error) {
            safeDispatch(() => dispatch(setError(error.message)));
            throw error;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    // Liste
    const setSeosFunc = async (filters = {}) => {
        try {
            safeDispatch(() => dispatch(setLoading(true)));

            const page = filters.pagination?.pageNumber || 1;
            const perPage = filters.pagination?.perPage || 10;
            const sortBy = filters.sort?.by || "id";
            const sortDir = filters.sort?.direction || "desc";
            const search = filters.search || "";

            const url = buildUrl(
                `${API_CONFIG.ENDPOINTS.SEO.BASE}?page=${page}&per_page=${perPage}&sort=${sortBy}&direction=${sortDir}&search=${encodeURIComponent(
                    search
                )}`
            );

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const payload = {
                seos: response.data.data || [],
                pagination: response.data.pagination || null,
            };

            safeDispatch(() => dispatch(setSeos(payload)));

            return payload;
        } catch (error) {
            safeDispatch(() => dispatch(setError(error.message)));
            throw error;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    // Oluştur
    const createSeo = async (formData) => {
        try {
            safeDispatch(() => dispatch(setLoading(true)));

            const url = buildUrl(API_CONFIG.ENDPOINTS.SEO.BASE);

            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                transformRequest: [(data) => data],
            });

            return response.data;
        } catch (error) {
            safeDispatch(() => dispatch(setError(error.message)));
            throw error;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    // Güncelle
    const updateSeo = async (formData, id) => {
        try {
            safeDispatch(() => dispatch(setLoading(true)));

            const url = buildUrl(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`);

            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { _method: "PUT" },
                transformRequest: [(data) => data],
            });

            return response.data;
        } catch (error) {
            safeDispatch(() => dispatch(setError(error.message)));
            throw error;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    // Sil
    const deleteSeo = async (id) => {
        try {
            safeDispatch(() => dispatch(setLoading(true)));

            const url = buildUrl(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`);

            await axios.delete(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (error) {
            safeDispatch(() => dispatch(setError(error.message)));
            throw error;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    // Type bazlı SEO
    const getSeoByType = async (type) => {
        try {
            if (!type) return null;

            safeDispatch(() => dispatch(setLoading(true)));

            const url = buildUrl(
                `${API_CONFIG.ENDPOINTS.SEO.BY_TYPE_REGION}?type=${type}`
            );

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            return response.data.data || response.data;
        } catch (error) {
            console.warn("getSeoByType hata:", error);
            return null;
        } finally {
            safeDispatch(() => dispatch(setLoading(false)));
        }
    };

    return {
        getSeo,
        setSeos: setSeosFunc,
        createSeo,
        updateSeo,
        deleteSeo,
        getSeoByType,
    };
};
