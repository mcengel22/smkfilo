import React from "react";
import { useTranslation } from "react-i18next";

// Panelden kategoriye kapak görseli eklenirse kart onu gösterir, yoksa marka renginde degrade
const CategoryCard = ({ category, onClick }) => {
    const { t } = useTranslation();
    const cover = category?.cover?.media_url;

    return (
        <button
            type="button"
            className={`category-card ${cover ? "has-cover" : ""}`}
            onClick={(e) => onClick(e, category?.slug)}
            style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        >
            <span className="category-card-body">
                <span className="category-card-title">{t(category.title)}</span>
                <span className="category-card-link">
                    {t("Araçları keşfet")}
                    <i className="icon arrow-right" />
                </span>
            </span>
        </button>
    );
};

export default CategoryCard;
