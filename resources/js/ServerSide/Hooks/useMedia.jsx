// src/hooks/useMedia.js
import React from 'react'; // ✅ Bu satırı ekle
import { useDispatch, useSelector } from 'react-redux';
import {
    setMedias,
    addMedias,
    removeMedia,
    setLoading,
    setError,
} from '../../Repo/Redux/Modules/MediaSlice';
import { API_CONFIG } from '../EndPoints';
import { apiService } from '../Load';

export const useMedia = () => {
    const dispatch = useDispatch();
    const token = useSelector((s) => s.auth.token);

    const medias = useSelector((s) => s.medias.medias);
    const loading = useSelector((s) => s.medias.loading);
    const error = useSelector((s) => s.medias.error);

    const [pagination, setPagination] = React.useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const getMedia = async (page = 1, append = false) => {
        try {
            dispatch(setLoading(true));
            const response = await apiService.get(
                `${API_CONFIG.ENDPOINTS.MEDIA.MEDIA}?page=${page}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const list = Array.isArray(response.data.data)
                ? response.data.data
                : Array.isArray(response.data)
                    ? response.data
                    : [];

            const meta =
                response.data.meta ||
                response.data.pagination || {
                    current_page: page,
                    last_page: page,
                    total: list.length,
                };

            if (append) dispatch(addMedias(list));
            else dispatch(setMedias(list));

            setPagination(meta);
            return list;
        } catch (err) {
            dispatch(setError(err.message));

            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    /**
     * 📌 Dosyaları tek tek upload eder
     * Büyük POST oluşmaz
     * Tarayıcı request iptal etmez
     */
    const createMedia = async (files) => {

        try {

            dispatch(setLoading(true));

            const uploadedMedias = [];

            // 🚀 her dosyayı sırayla gönder
            for (const file of files) {

                const fd = new FormData();

                /**
                 * 📌 Tek dosya ekleniyor
                 * Artık 80MB yerine max 8MB request gider
                 */
                fd.append('files[]', file);

                const response = await apiService.post(
                    API_CONFIG.ENDPOINTS.MEDIA.MEDIA,
                    fd,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },

                        /**
                         * 📌 Büyük dosya için timeout artırıldı
                         */
                        timeout: 1000 * 60 * 5
                    }
                );

                const added = Array.isArray(response.data.data)
                    ? response.data.data
                    : Array.isArray(response.data)
                        ? response.data
                        : [];

                uploadedMedias.push(...added);

                /**
                 * 📌 Her upload sonrası redux’a ekle
                 */
                dispatch(addMedias(added));
            }

            return uploadedMedias;

        } catch (err) {

            dispatch(setError(err.message));
            throw err;

        } finally {

            dispatch(setLoading(false));
        }
    };


    const deleteMedia = async (mediaId) => {
        try {
            dispatch(setLoading(true));
            await apiService.delete(
                `${API_CONFIG.ENDPOINTS.MEDIA.MEDIA}/${mediaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(removeMedia(mediaId));
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        medias,
        loading,
        error,
        pagination,
        getMedia,
        createMedia,
        deleteMedia,
    };
};
