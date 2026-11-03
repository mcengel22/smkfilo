import React from "react";
import { useTranslation } from "react-i18next";

const CouponPage = () => {
    const { t } = useTranslation();

    return (
        <div className="payment-page py-10">
            <div className="max-w-4xl mx-auto px-4">

                {/* BAŞLIK */}
                <h1 className="text-3xl font-bold mb-6">{t("Kupon Satın Al")}</h1>

                {/* AÇIKLAMA BLOĞU */}
                <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                    <p className="text-lg font-medium mb-3">
                        {t(
                            "Kupon satın alarak tatilinizi daha esnek hale getirebilir ve dilediğiniz konaklama yerinde özgürce kullanabilirsiniz."
                        )}
                    </p>

                    <p className="text-gray-600 leading-relaxed mb-3">
                        {t(
                            "Kupon satın alma işlemleri şu anda müşteri temsilcilerimiz tarafından yapılmaktadır. Aşağıdaki iletişim kanallarımızdan bize ulaşarak dilediğiniz tutarda kupon satın alabilirsiniz."
                        )}
                    </p>

                    {/* 🎁 Hediye Bilgisi */}
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="font-semibold text-gray-800">
                            🎁 {t("Kuponu hediye olarak da satın alabilirsiniz")}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            {t(
                                "Satın aldığınız kuponu arkadaşınıza, sevgilinize veya ailenize hediye etmek için kullanabilirsiniz. Kupon, hediye kartı şeklinde düzenlenip tarafınıza iletilebilir."
                            )}
                        </p>
                    </div>
                </div>

                {/* İLETİŞİM SEÇENEKLERİ */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/905013024242"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 transition text-white p-6 rounded-xl shadow-md flex flex-col items-center"
                    >
                        <span className="text-4xl mb-2">📱</span>
                        <span className="font-bold text-lg">{t("WhatsApp ile İletişim")}</span>
                        <span className="text-sm opacity-90 mt-1">
                            {t("7/24 hızlı destek")}
                        </span>
                    </a>

                    {/* Telefon */}
                    <a
                        href="tel:+90 501 302 42 42"
                        className="bg-blue-600 hover:bg-blue-700 transition text-white p-6 rounded-xl shadow-md flex flex-col items-center"
                    >
                        <span className="text-4xl mb-2">📞</span>
                        <span className="font-bold text-lg">{t("Telefon ile Sipariş")}</span>
                        <span className="text-sm opacity-90 mt-1">
                            {t("Hafta içi 09:00 – 18:00")}
                        </span>
                    </a>

                </div>

                {/* ALT BİLGİ */}
                <div className="mt-10 text-center text-gray-600">
                    {t(
                        "Kupon satın alma işlemi tamamen güvenlidir. Ödemeler şirketimiz adına resmi POS altyapısıyla yapılır."
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponPage;
