import { useTranslation } from "react-i18next";

export const TYPE = () => { // Named export ile TYPE'ı dışa aktar
    const { t } = useTranslation();
    return {
        boat: t('Yat'),
        bungalow: t('Bungalov'),
        villa: t('Villa'),
    };
};
