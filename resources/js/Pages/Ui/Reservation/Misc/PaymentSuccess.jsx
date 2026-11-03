import React from "react";
import Header from "../../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { ROUTES } from "../../../../Libs/Routes/config";


const PaymentSuccess = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    return (
        <div>
            <Header />
            <div className="payment-success">
                <div className="success-content card bg-white">
                    <div className="success-icon">
                        <img
                            src="/svg/success-check.svg"
                            alt="Başarılı"
                            width={64}
                            height={64}
                            priority
                        />
                    </div>

                    <h1>{t('Ödemeniz Başarıyla Tamamlandı!')}</h1>
                    <p className="message">
                        {t('  Rezervasyon detaylarınız e-posta adresinize gönderilmiştir.')}
                    </p>

                    <div className="info-box">
                        <div className="info-row">
                            <span className="label">{t('Rezervasyon No')}</span>
                            <span className="value">
                                {searchParams.get('oid') || '-'}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="label">{t('Ödeme Tutarı')}</span>
                            <span className="value">
                                ₺ {searchParams.get('amount')
                                    ? new Intl.NumberFormat('tr-TR').format(searchParams.get('amount'))
                                    : '-'}
                            </span>
                        </div>
                    </div>

                    <Link to={ROUTES.UI.LANDING} className="home-button">
                        {t('Ana Sayfaya Dön')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess;
