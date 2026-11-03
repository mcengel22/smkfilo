import { useTranslation } from "react-i18next";

export const ATTRS = () => {
    const { t } = useTranslation();
    return [
        { key: "nears", value: t("Araç Markası") },
        { key: "categories", value: t("Araç Türleri") },
        { key: "features", value: t("Araç Özellikler") },
        { key: "operations", value: t("Araç Yakıt") },
        { key: "rules", value: t("Araç Kuralları") },
    ];
};
