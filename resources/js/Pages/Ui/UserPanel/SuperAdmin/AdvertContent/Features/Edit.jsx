import React from "react";
import { useTranslation } from 'react-i18next';
import AttrEdit from "../Misc/Edit";

const FeaturesEdit = () => {
    const { t } = useTranslation();
    return (
        <div>
            <div className="title">
                <h1>{t('Özellik Yönetimi')}</h1>
                <span className="sub-title">{t('Özellik Düzenle')}</span>
            </div>
            <AttrEdit />
        </div>

    );
};

export default FeaturesEdit;
