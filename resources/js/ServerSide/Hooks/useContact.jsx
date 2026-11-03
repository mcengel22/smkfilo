import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setContacts
}  from '../../Repo/Redux/Modules/ContactSlice.jsx';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';


export const useContact = () => {
    const dispatch = useDispatch();

    const setContact = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.CONTACT.CONTACT);

            // Sadece data kısmını dispatch et
            dispatch(setContacts(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
    const deleteContacts = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.CONTACT.CONTACT}/${id}`);

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };

    const createContact = async (contact) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.CONTACT.CONTACT, contact, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        }catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        }
        finally{
            dispatch(setLoading(false));
        }
    }


    return {
        setContacts: setContact,
        createContacts: createContact,
        deleteContacts: deleteContacts,
    };
};
