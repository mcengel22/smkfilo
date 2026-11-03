import React from "react";
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { t } = useTranslation();
  return (
    <div className="institutional-banner">
      <h1 className="text-white font-light text-center leading-[32.5px] md:leading-[55px] text-[34px] md:text-[40px]">
      {t('Ücretsiz üye ol')}
        <b className="font-bold text-white">
          <br/>{t(' %5 satıcı komisyonu ile')} <br/>
        </b>
        {t('anında rezervasyon almaya başla!')}
      </h1>
    </div>
  );
}

export default Banner;
