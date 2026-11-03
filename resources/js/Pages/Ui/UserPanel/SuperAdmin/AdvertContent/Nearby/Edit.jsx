import React from "react";
import { useTranslation } from 'react-i18next';
import AttrEdit from "../Misc/Edit";

const NearbyEdit = () => {
    const { t } = useTranslation();
    return (

        <div>
            <div className="title">
                <h1>{t('Markalar Yönetimi')}</h1>
                <span className="sub-title">{t('Marka Düzenle')}</span>
            </div>
            <AttrEdit />
        </div>

    );

}


export default NearbyEdit;