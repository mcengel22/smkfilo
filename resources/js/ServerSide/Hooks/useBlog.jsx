import { useDispatch } from "react-redux";
import {
    setError,
    setLoading,
    setBlogs,
    getBlog as setSingleBlog,
} from "@/Repo/Redux/Modules/BlogSlice";
import { API_CONFIG } from "../EndPoints";
import axios from "axios";

export const useBlog = () => {
    const dispatch = useDispatch();

    const buildUrl = (endpoint = "") => {
        const base = API_CONFIG?.BASE_URL;
        const cleanBase = base.replace(/\/$/, "");
        const cleanEp = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        return `${cleanBase}${cleanEp}`;
    };

    const authHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const request = async (callback, message = "İşlem başarısız.") => {
        try {
            dispatch(setLoading(true));
            return await callback();
        } catch (error) {
            console.error("❌ BLOG API ERROR:", error);
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const setBlogsFunc = async (filters = {}) =>
        request(async () => {
            const page = filters.pagination?.pageNumber ?? 1;
            const perPage = filters.pagination?.perPage ?? 10;
            const sortBy = filters.sort?.by ?? "id";
            const sortDir = filters.sort?.direction ?? "desc";
            const search = filters.search ?? "";

            const url = buildUrl(
                `${API_CONFIG?.ENDPOINTS?.BLOG?.BASE || "/api/v1/blog"}?page=${page}&per_page=${perPage}&sort=${sortBy}&direction=${sortDir}&search=${encodeURIComponent(search)}`
            );

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    ...authHeader(),
                },
            });

            const payload = {
                blogs: response.data.data || [],
                pagination: response.data.pagination || null,
            };

            dispatch(setBlogs(payload));
            return payload;
        });

    const getBlog = async (slug) =>
        request(async () => {
            if (!slug) throw new Error("Slug gerekli");

            const baseEp = API_CONFIG?.ENDPOINTS?.BLOG?.BASE || "/api/v1/blog";
            const url = buildUrl(`${baseEp}/${slug}`);

            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    ...authHeader(),
                },
            });

            const data = response.data.data || response.data;
            dispatch(setSingleBlog(data));
            return data;
        });

    const createBlog = async (formData) =>
        request(async () => {
            const url = buildUrl(API_CONFIG?.ENDPOINTS?.BLOG?.BASE || "/api/v1/blog");

            const response = await axios.post(url, formData, {
                headers: {
                    Accept: "application/json",
                    ...authHeader(),
                },
            });

            return response.data;
        });

    // ✔ BLOG UPDATE — FINAL VERSION (PUT WORKS)
    const updateBlog = async (id, formData) =>
        request(async () => {
            if (!id) throw new Error("ID gerekli");

            const baseEp = API_CONFIG?.ENDPOINTS?.BLOG?.BASE || "/api/v1/blog";
            const url = buildUrl(`${baseEp}/${id}`);

            formData.append("_method", "PUT"); // 💥 PUT override burada

            const response = await axios.post(url, formData, {
                headers: {
                    Accept: "application/json",
                    ...authHeader(),
                },
            });

            return response.data;
        });

    const deleteBlog = async (id) =>
        request(async () => {
            if (!id) throw new Error("ID gerekli");

            const baseEp = API_CONFIG?.ENDPOINTS?.BLOG?.BASE || "/api/v1/blog";
            const url = buildUrl(`${baseEp}/${id}`);

            await axios.delete(url, {
                headers: {
                    Accept: "application/json",
                    ...authHeader(),
                },
            });
        });

    return {
        setBlogs: setBlogsFunc,
        getBlog,
        createBlog,
        updateBlog,
        deleteBlog,
    };
};
