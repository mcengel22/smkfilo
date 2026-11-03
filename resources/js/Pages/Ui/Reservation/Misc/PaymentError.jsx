import React, { useEffect, useState } from "react";
import Header from "../../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../Libs/Routes/config";
import { usePayment } from "../../../../ServerSide/Hooks/usePayment.jsx";
import { useSelector, useDispatch } from "react-redux";
import { resetAllPaymentState } from "../../../../Repo/Redux/Modules/PaymentSlice";

const PaymentError = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const payment = useSelector(state => state.payment);
    const [isProcessing, setIsProcessing] = useState(false);
    const { failPayment } = usePayment();

    useEffect(() => {
        // Automatically cancel the payment when the error page loads
        if (payment.reservationId) {
            cancelPayment();
        }
    }, [payment.reservationId]);

    const cancelPayment = async () => {
        try {
            setIsProcessing(true);
            const data = {
                reservationId: payment.reservationId,
            };
            await failPayment(data);
            setIsProcessing(false);
        } catch (error) {
            console.error("Failed to cancel payment:", error);
            setIsProcessing(false);
        }
    };

    const handleOkClick = () => {
        dispatch(resetAllPaymentState());
        navigate(ROUTES.UI.LANDING);
    };

    return (
        <div>
            <Header />
            <div className="payment-result failed">
                <div className="result-content card bg-white">
                    <div className="result-icon">
                        <img
                            src="/svg/failed-cross.svg"
                            alt="Başarısız"
                            width={64}
                            height={64}
                            priority
                        />
                    </div>

                    <h1>{t('Ödeme İşlemi Başarısız')}</h1>
                    <p className="message">
                        {t(' Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.')}
                    </p>

                    <div className="info-box">
                        {payment.reservationId && (
                            <div className="info-row">
                                <span className="label">{t('Rezervasyon No')}</span>
                                <span className="value">{payment.reservationId}</span>
                            </div>
                        )}
                        {payment.amount && (
                            <div className="info-row">
                                <span className="label">{t('Ödeme Tutarı')}</span>
                                <span className="value">
                                    ₺ {new Intl.NumberFormat('tr-TR').format(payment.amount)}
                                </span>
                            </div>
                        )}
                        <div className="error-details">
                            <span className="error-code">{t('Hata Kodu:')} ERR_PAYMENT_FAILED</span>
                            <p className="error-message">
                                {t(' Kartınızdan ödeme alınamadı. Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz veya farklı bir ödeme yöntemi kullanınız.')}
                            </p>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            className="cancel-button"
                            onClick={handleOkClick}
                            disabled={isProcessing}
                        >
                            {isProcessing ? t('İşleniyor...') : t('Tamam')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentError;
