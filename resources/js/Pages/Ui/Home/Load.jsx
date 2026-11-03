import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {useTranslation} from "react-i18next";
import { useAttr } from "../../../ServerSide/Hooks/useAttr";
import { useFaq } from "../../../ServerSide/Hooks/Faq";
import { useBlog } from "../../../ServerSide/Hooks/useBlog";
import { useCampaign } from "../../../ServerSide/Hooks/useCampaign";
import { usePopulerregion } from "../../../ServerSide/Hooks/usePopulerregion";
import { useShowcase } from "../../../ServerSide/Hooks/useShowcase";
import {selectFaqs} from "../../../Repo/Redux/Modules/FaqSlice";

const HomeLoad = () => {

    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();
    // Check Redux
    const categories = useSelector(state => state.attr.categories);
    const faqs = useSelector(selectFaqs);
    const blogs = useSelector(state => state.home.blog.blogs);
    const campaigns = useSelector(state => state.home.campaign.campaigns);
    const popular_regions = useSelector(state => state.home.populerregion.populerregions);
    const showcases = useSelector(state => state.home.showcase.showcases);

    // Hooks
    const { setCategories } = useAttr();
    const { setFaqs } = useFaq();
    const { setBlogs } = useBlog();
    const { setCampaigns } = useCampaign();
    const { setPopulerregions } = usePopulerregion();
    const { setShowcases } = useShowcase();

    useEffect(() => {
        const getCategory = async () => {
            try {
                setIsLoading(true);
                await setCategories();
            } catch (error) {
                console.error(t("Kategori yüklenirken hata:"), error);
            } finally {
                setIsLoading(false);
            }
        };

        const getFaqs = async () => {
            try {
                await setFaqs();
            } catch (error) {
                console.error(t("S.S.S. yüklenirken hata:"), error);
            }
        };

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
        const getPopularRegions = async () => {
            try {
                await setPopulerregions();
            } catch (error) {
                console.error(t("Popüler Bölgeler yüklenirken hata:"), error);
            }
        };

        const getShowCases = async () => {
            try {
                await setShowcases();
            } catch (error) {
                console.error(t("Vitrin yüklenirken hata:"), error);
            }
        };


        getCategory();
        getFaqs();
        getBlogs();
        getCampaigns();
        getPopularRegions();
        getShowCases();

    }, []);

    return null; // veya loading komponenti
};

export default HomeLoad;
