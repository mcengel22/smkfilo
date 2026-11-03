import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategoryCard = ({category,onClick}) => {
    const { t } = useTranslation();
    return (
        <div className="card">
            <Link to="#" onClick={(e) => onClick(e, category?.slug)}>


                <i className={category?.info?.icon_class ? category?.info?.icon_class : 'icon house'} />
                <span>{t(category.title)}</span>
            </Link>
        </div>
    );
};

export default CategoryCard;
