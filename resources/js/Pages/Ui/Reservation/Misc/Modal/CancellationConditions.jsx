import { useState } from "react";
import CancellationConditions from "../../../Agreements/Misc/CancellationConditions";
import { useTranslation } from "react-i18next";

const CancellationConditionsModal = ({ termsAccepted, setTermsAccepted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="me-2 w-5 h-5 accent-orange-500 cursor-pointer"
                />
                <div>
                    <span
                        onClick={() => setIsOpen(true)}
                        className="font-medium text-orange-500 cursor-pointer text-sm"
                    >
                        İptal Şartlarını
                    </span>
                    <label
                        htmlFor="acceptTerms"
                        className="ml-1 text-sm text-gray-700"
                    >
                        okudum, anladım, kabul ediyorum.
                    </label>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal-agreement">
                    <div className="bg-white p-3 rounded-lg shadow-lg w-3/4 max-w-lg modal-body">
                        <div className="content">
                            <div className="w-full px-3">
                                <div className="bg-white rounded-lg p-4">
                                    <h2 className="text-lg font-bold mb-6 text-center">
                                        {t(
                                            "Rezervasyon ve Ödeme & İptal Şartları",
                                        )}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {t(
                                            "Tourency hesabına yatırılan arac bedelinin",
                                        )}
                                        <strong>{t(" ön ödeme")}</strong>
                                        {t(
                                            " (hangi kanaldan yapılmış olursa olsun) bedeli, seyahat başlangıcına ",
                                        )}
                                        <strong>{t("90 günden az")}</strong>
                                        {t(" kaldıysa müşteriye ")}
                                        <strong>
                                            {t("geri ödenmeyecektir")}
                                        </strong>
                                        .
                                    </p>
                                    <h3 className="text-md font-semibold mb-0">
                                        {t("İptal Şartları ")}
                                    </h3>
                                    <ul className="mb-4">
                                        <li>
                                            <strong>
                                                {t(" 90 Gün Öncesine Kadar")}
                                            </strong>
                                            {t(" Ön ödeme iade edilir.")}
                                        </li>
                                        <li>
                                            <strong>
                                                {t(" 60 Gün Öncesine Kadar")}
                                            </strong>
                                            {t(
                                                " Müşteri toplam kiralama bedelinin %35’ini ödemek zorundadır.",
                                            )}
                                        </li>
                                        <li className="mb-1">
                                            <strong>
                                                {t(" 29 Gün veya Daha Az")}
                                            </strong>
                                            {t(
                                                " Müşteri, seyahat bedelinin %100’ünü ödemek zorundadır.",
                                            )}
                                        </li>
                                    </ul>
                                    <h3 className="text-md font-semibold mb-0">
                                        {t("Tüm Ödemenin Yapılması Durumu ")}
                                    </h3>
                                    {/* <p className="mb-1">
                                {t('Eğer müşteri villa, apart, daire, bungalov, yat, tekne, otel, kaplıca bedelinin ')}<strong>{t('tamamını ')}</strong>
                                {t('Tourency’a öderse ve iptal etmek isterse:')}
                            </p> */}
                                    <ul>
                                        <li>
                                            <strong>
                                                {t(" 30 Gün Kalıncaya Kadar:")}
                                            </strong>
                                            {t(
                                                " Ödenen bedelin %30’u kesilir, %70’i iade edilir.",
                                            )}
                                        </li>
                                        <li>
                                            <strong>
                                                {t(" 30 Gün Kalıncaya Kadar:")}
                                            </strong>
                                            {t(
                                                " Ödenen bedelin %30’u kesilir, %70’i iade edilir.",
                                            )}
                                        </li>
                                        <li className="mb-1">
                                            <strong>
                                                {t(" 29 Gün veya Daha Az")}
                                            </strong>
                                            {t(" Hiçbir ödeme iade edilmez.")}
                                        </li>
                                    </ul>
                                    <h3 className="text-md font-semibold mb-0">
                                        {t(" Kredi Kartı ile Ödeme ")}
                                    </h3>
                                    <p>
                                        {t(
                                            "Kredi kartı ile yapılan ödemelerin ",
                                        )}
                                        <strong>
                                            {t("iade işlemlerinden")}
                                        </strong>
                                        {t(
                                            " kaynaklanabilecek maddi zararlar Tatil Merası’na yüklenemez. Komisyon ücreti gibi kesintiler, iade edilecek tutardan düşülerek işlem yapılır.",
                                        )}
                                    </p>

                                    <div className="border-t border-gray-300 mt-6 pt-4 text-gray-700 text-center">
                                        <p>
                                            <strong>
                                                ©{t(" 2025 Tourency")}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setTermsAccepted(true); // Checkbox'ı işaretle
                                setIsOpen(false); // Modalı kapat
                            }}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
                        >
                            Onayla
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancellationConditionsModal;
