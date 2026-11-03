import {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import {useTranslation} from "react-i18next";
import { useCampaign } from "../../../ServerSide/Hooks/useCampaign";
import { useAttr } from "../../../ServerSide/Hooks/useAttr";
const ListingLoad = () => {

    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();
    // Check Redux

    // Hooks
    const { setFeatures, setRules, setOperations, setNears } = useAttr();

    useEffect(() => {
        const getFeatures = async () => {
            try {
                setIsLoading(true);
                await setFeatures();
            } catch (error) {
                console.error(t("Özellikler yüklenirken hata:"), error);
            } finally {
                setIsLoading(false);
            }
        };

        const getRules = async () => {
            try {
                setIsLoading(true);
                await setRules();
            } catch (error) {
                console.error(t("Kurallar yüklenirken hata:"), error);
            } finally {
                setIsLoading(false);
            }
        };

        const getOperations = async () => {
            try {
                setIsLoading(true);
                await setOperations();
            } catch (error) {
                console.error(t("Kurallar yüklenirken hata:"), error);
            } finally {
                setIsLoading(false);
            }
        };

        const getNears = async () => {
            try {
                setIsLoading(true);
                await setNears();
            } catch (error) {
                console.error(t("Kurallar yüklenirken hata:"), error);
            } finally {
                setIsLoading(false);
            }
        };


        getFeatures();
        getRules();
        getOperations();
        getNears();

    }, []);

    return null; // veya loading komponenti
};

export default ListingLoad;
