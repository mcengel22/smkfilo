import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import { useBlog } from "../../../ServerSide/Hooks/useBlog";
import { useCampaign } from "../../../ServerSide/Hooks/useCampaign";
import { useShowcase } from "../../../ServerSide/Hooks/useShowcase";

// Kategoriler ve popüler bölgeler Footer tarafından yükleniyor (panelde de gerekli oldukları için),
// SSS ise Faq bileşeninin kendisi tarafından çekiliyor.
const HomeLoad = () => {
    const {t} = useTranslation();

    // Hooks
    const { setBlogs } = useBlog();
    const { setCampaigns } = useCampaign();
    const { setShowcases } = useShowcase();

    useEffect(() => {
        const getBlogs = async () => {
            try {
                await setBlogs();
            } catch (error) {
                console.error(t("Bloglar yüklenirken hata:"), error);
            }
        };
        const getCampaigns = async () => {
            try {
                await setCampaigns();
            } catch (error) {
                console.error(t("Kampanyalar yüklenirken hata:"), error);
            }
        };

        const getShowCases = async () => {
            try {
                await setShowcases();
            } catch (error) {
                console.error(t("Vitrin yüklenirken hata:"), error);
            }
        };

        getBlogs();
        getCampaigns();
        getShowCases();

    }, []);

    return null; // veya loading komponenti
};

export default HomeLoad;
