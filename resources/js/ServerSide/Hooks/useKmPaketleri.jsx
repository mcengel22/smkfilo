import { useDispatch } from 'react-redux';
import {
    setKmPackages,
    setPagination,
    setLoading,
    setError,
    addKmPackage,
    updateKmPackage,
    removeKmPackage,
} from '../../Repo/Redux/Modules/KmPaketleriSlice';
import axios from 'axios';

export const useKmPaketleri = () => {
    const dispatch = useDispatch();

    const fetchKmPackages = async (params = {}) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get('/api/v1/km-paketleri', { params });
            if (response.data.success) {
                dispatch(setKmPackages(response.data.data));
                dispatch(setPagination(response.data.meta || null));
                return response.data;
            }
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getKmPackage = async (id) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`/api/v1/km-paketleri/${id}`);
            return response.data;
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createKmPackage = async (data) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.post('/api/v1/km-paketleri', data);
            if (response.data.success) {
                dispatch(addKmPackage(response.data.data));
                return response.data;
            }
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const editKmPackage = async (id, data) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.put(`/api/v1/km-paketleri/${id}`, data);
            if (response.data.success) {
                dispatch(updateKmPackage(response.data.data));
                return response.data;
            }
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const deleteKmPackage = async (id) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.delete(`/api/v1/km-paketleri/${id}`);
            if (response.data.success) {
                dispatch(removeKmPackage(id));
                return response.data;
            }
        } catch (err) {
            dispatch(setError(err.message));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        fetchKmPackages,
        getKmPackage,
        createKmPackage,
        editKmPackage,
        deleteKmPackage,
    };
};
