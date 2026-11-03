import { apiService } from '../Load';
import { API_CONFIG } from "../EndPoints";
import {toast} from "react-toastify";
import {t} from "i18next";

export const useIcons = () => {
    const getSelect2Icons = async (term) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.ICONS.SELECT2}`);

            return response.data;

        } catch (error) {
            toast.error(t('İkonlar Yüklenemedi'))
            throw error;
        }
    };

    return {
        select2Icons: getSelect2Icons,
    };
};
