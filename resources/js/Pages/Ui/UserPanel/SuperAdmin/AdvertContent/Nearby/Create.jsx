import React from "react";

const NearbyCreate = () => {

    return (
        <div className="attr-page">
            <div className="title">
                <h1>{t('Markalar Yönetimi')}</h1>
                <span className="sub-title">{t('Yeni Marka')}</span>
            </div>
            <AttrCreate />
        </div>
    )
}


export default NearbyCreate;