import { apiService } from '../Load';
import { API_CONFIG } from "../EndPoints";
import {toast} from "react-toastify";
import {t} from "i18next";

export const useRegions = () => {
    const getSelect2Regions = async (term) => {
        try {
            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.REGIONS.SELECT2}?term=${term}`);

            return response.data;

        } catch (error) {
            throw error;
        }
    };

    return {
        select2Regions: getSelect2Regions,
    };
};
