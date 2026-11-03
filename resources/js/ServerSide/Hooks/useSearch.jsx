import { apiService } from '../Load';
import { API_CONFIG } from "../EndPoints";
import {toast} from "react-toastify";
import {t} from "i18next";

export const useSearch = () => {
    const getSelect2Search = async (term) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.SEARCH.SELECT2}?term=${term}`);

            console.log(response.data);
            // Yanıt verisinin yapısını kontrol et
            if (Array.isArray(response.data.results)) {
                return response.data.results; // Eğer array ise direkt döndür
            } else if (response.data && Array.isArray(response.data.results)) {
                return response.data.results; // Eğer nesne içindeyse 'results' öğesinden döndür
            } else if (response.data && Array.isArray(response.data.data)) {
                return response.data.data; // Eğer nesne içindeyse 'data' öğesinden döndür
            } else {
                return []; // Beklenmedik bir durumsa boş bir array döndür
            }
        } catch (error) {
            console.error("API Hatası:", error.response?.data || error.message);
            toast.error(t('Sonuç beklenirken hata oluştu.'));
            return []; // Hata durumunda boş bir array döndür
        }
    };

    return {
        select2Search: getSelect2Search,
    };
};
