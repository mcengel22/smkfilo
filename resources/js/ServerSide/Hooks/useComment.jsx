import { useDispatch } from 'react-redux';
import {
    setComments,
    setError,
    setLoading
} from '../../Repo/Redux/Modules/CommentSlice';
import { API_CONFIG } from "../EndPoints";
import { t } from "i18next";
import { apiService } from '../Load';

export const useComment = () => {
    const dispatch = useDispatch();

    const getComment = async (postId) => {
        try {
            dispatch(setLoading(true));

            const url = postId
                ? `${API_CONFIG.ENDPOINTS.COMMENT.COMMENTS}/${postId}`
                : `${API_CONFIG.ENDPOINTS.COMMENT.COMMENTS}`;

            const response = await apiService.get(url);

            // 🔥 DÜZELTİLMİŞ HALİ (DOĞRU ACTION)
            dispatch(setComments(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
    const createComment = async (payload) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.COMMENT.COMMENTADD,
                payload
            );

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            throw error;

        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteComment = async (id) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.COMMENT.COMMENTADD}/${id}`);

            await getComment(); // liste güncelle

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const rejectComment = async (id) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.COMMENT.COMMENTREJECT}/${id}`);

            await getComment();

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const approveComment = async (id) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.put(`${API_CONFIG.ENDPOINTS.COMMENT.COMMENTAPPROVE}/${id}`);

            await getComment();

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        getComment,
        rejectComment,
        approveComment,
        deleteComment,
        createComment, // ← EKLENEN FONKSİYON
    };
};
