import {useDispatch, useSelector} from 'react-redux';
import {
    setError,
    setLoading,
    setCampaigns,
    getCampaign
}  from '../../Repo/Redux/Modules/CampaignSlice';
import { API_CONFIG } from "../EndPoints";
import { toast } from "react-toastify";
import { t } from "i18next";
import { apiService } from '../Load';
import campaign from "@/Pages/Ui/Home/Misc/Campaign.jsx";


export const useCampaign = () => {
    const dispatch = useDispatch();

    const setCampaign = async () => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(API_CONFIG.ENDPOINTS.CAMPAIGN.CAMPAIGN);

            // Sadece data kısmını dispatch et
            dispatch(setCampaigns(response.data));

            return response.data;

        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    const get_campaign = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.get(`${API_CONFIG.ENDPOINTS.CAMPAIGN.CAMPAIGN}/${id}`);

            dispatch(getCampaign(response.data));
            return response.data;
        }catch (error) {
            toast.error("Kampanya Yüklenemedi.");
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }

    const updateCampaign = async (campaign,slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.CAMPAIGN.CAMPAIGNEDIT}/${slug}`, campaign, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(t('Kampanya Güncellendi'));
            return response.data;
        }catch (error) {
            dispatch(setError(error.message));
            toast.error('Müşteri Düzenlenemedi.');
            throw error;
        }finally {
            dispatch(setLoading(false));
        }
    }



    const deleteCampaigns = async (id) => {
        try {
            dispatch(setLoading(true));

            // Silme işlemi için sadece ID gönderiyoruz.
            const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.CAMPAIGN.CAMPAIGN}/${id}`);

            toast.success(t('Kampanya Silindi'));
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...')); // Hata mesajını göster
            throw error;
        } finally {
            dispatch(setLoading(false)); // Yükleme durumunu sona erdir
        }
    };

    const createCampaign = async (campaign) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.CAMPAIGN.CAMPAIGN, campaign, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(t('Kampanya Kaydedildi'));
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
        setCampaigns: setCampaign,
        getCampaigns: get_campaign,
        deleteCampaigns: deleteCampaigns,
        createCampaign: createCampaign,
        updateCampaign: updateCampaign,
    };
};
