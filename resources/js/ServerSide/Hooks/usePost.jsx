import { useDispatch, useSelector } from "react-redux";
import {
    setError,
    setLoading,
    setPosts,
    getPosts,
    setDetails,
} from "../../Repo/Redux/Modules/PostSlice";
import { API_CONFIG } from "../EndPoints";
import { t } from "i18next";
import { apiService } from "../Load";

export const usePost = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth?.token);

    // Helper to convert object to FormData recursively
    const toFormData = (obj, form = null, namespace = '') => {
        const fd = form || new FormData();
        let formKey;

        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }

                if (obj[property] instanceof Date) {
                    fd.append(formKey, obj[property].toISOString());
                } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File) && obj[property] !== null) {
                    toFormData(obj[property], fd, formKey);
                } else {
                    if (obj[property] !== null && obj[property] !== undefined) {
                        fd.append(formKey, obj[property]);
                    }
                }
            }
        }
        return fd;
    };

    // ✅ TÜM POSTLARI GETİR
    const setPost = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.POST.POST);
            dispatch(setPosts(response.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ GET POST (listeleme)
    const getPost = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.POST.POST);
            dispatch(getPosts(response.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ TEK POST (slug ile)
    const get_post = async (slug) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.POST.POST}/${slug}`);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ POST GÜNCELLE
    const updatePost = async (post, slug) => {
        try {
            dispatch(setLoading(true));

            const formData = toFormData(post);

            // Laravel bazen PUT/PATCH isteklerinde FormData'yı okuyamaz, bu yüzden _method=PUT ekleyebiliriz
            // Ancak burada POST isteği yapılıyor gibi görünüyor (POSTEDIT).
            // Eğer endpoint PUT bekliyorsa ve biz POST atıyorsak _method field eklemek gerekebilir.
            // Şimdilik olduğu gibi bırakıyorum.

            const response = await apiService.post(
                `${API_CONFIG.ENDPOINTS.POST.POSTEDIT}/${slug}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ SUPER ADMIN TÜM POSTLARI GETİR
    const getSuperPost = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.POST.SUPER.ALL);
            dispatch(getPosts(response.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ POSTLARI FİLTRE İLE GETİR
    const setPostByFilter = async (filter) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.POST.FILTER, filter);
            dispatch(setPosts(response.data.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ SUPER ADMIN FİLTRELİ POSTLAR
    const setSuperPostByFilter = async (filter) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.POST.SUPER.FILTER, filter);
            dispatch(setPosts(response.data.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ SLUG’A GÖRE TEK POST DETAYI
    const setPostBySlug = async (slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.POST.DETAIL}/${slug}`);
            dispatch(setDetails(response.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ TYPE’A GÖRE POST GETİR (örnek: villa, bungalow vs.)
    const setPostType = async (type) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.POST.TYPE}/${type}`);
            dispatch(setDetails(response.data));

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ YENİ POST OLUŞTUR
    const createPost = async (post) => {
        try {
            dispatch(setLoading(true));

            const formData = toFormData(post);

            const response = await apiService.post(API_CONFIG.ENDPOINTS.POST.POST, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ POST SİL
    const deletePosts = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.POST.POST}/${id}`);
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ Export edilen tüm fonksiyonlar
    return {
        setPosts: setPost,
        getPosts: getPost,
        get_post: get_post,
        updatePosts: updatePost,
        getSuperPosts: getSuperPost,
        setPostTypes: setPostType,
        setPostsByFilter: setPostByFilter,
        setSuperPostByFilter: setSuperPostByFilter,
        setPostBySlug: setPostBySlug,
        createPost: createPost,
        deletePost: deletePosts,
    };
};
