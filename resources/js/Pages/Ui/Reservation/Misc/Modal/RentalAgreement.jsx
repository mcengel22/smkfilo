import { useState } from "react";
import { useTranslation } from "react-i18next";

const RentalAgreementModal = ({ contractAccepted, setContractAccepted }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation();

    return (
        <div>
            {/* CHECKBOX */}
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="acceptContract"
                    checked={contractAccepted}
                    onChange={(e) => setContractAccepted(e.target.checked)}
                    className="
                        mt-1
                        w-5
                        h-5
                        accent-orange-500
                        cursor-pointer
                    "
                />

                <div>
                    <span
                        onClick={() => setIsOpen(true)}
                        className="
                            font-semibold
                            text-orange-500
                            cursor-pointer
                            hover:underline
                        "
                    >
                        {t("Araç Kiralama Sözleşmesini")}
                    </span>

                    <label
                        htmlFor="acceptContract"
                        className="
                            ml-1
                            text-gray-700
                            text-sm
                        "
                    >
                        {t("okudum, anladım ve kabul ediyorum.")}
                    </label>
                </div>
            </div>

            {/* MODAL */}
            {isOpen && (
                <div
                    className="
                    fixed
                    inset-0
                    z-[9999]
                    bg-black/70
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    p-4
                "
                >
                    <div
                        className="
                        bg-white
                        w-full
                        max-w-5xl
                        rounded-[32px]
                        overflow-hidden
                        shadow-2xl
                        animate-fadeIn
                    "
                    >
                        {/* HEADER */}
                        <div
                            className="
                            relative
                            bg-gradient-to-r
                            from-gray-900
                            to-black
                            px-8
                            py-8
                        "
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="
                                    absolute
                                    top-5
                                    right-5
                                    w-10
                                    h-10
                                    rounded-full
                                    bg-white/10
                                    hover:bg-white/20
                                    text-white
                                    transition
                                "
                            >
                                ✕
                            </button>

                            <span
                                className="
                                inline-flex
                                px-4
                                py-2
                                rounded-full
                                bg-orange-500/20
                                text-orange-400
                                font-semibold
                                mb-5
                            "
                            >
                                SMK Filo
                            </span>

                            <h2
                                className="
                                text-4xl
                                font-black
                                text-white
                            "
                            >
                                {t("Araç Kiralama ve Kullanım Sözleşmesi")}
                            </h2>

                            <p
                                className="
                                text-gray-300
                                mt-4
                                text-lg
                            "
                            >
                                {t(
                                    "Uzun dönem araç kiralama ve filo kullanım koşulları",
                                )}
                            </p>
                        </div>

                        {/* BODY */}
                        <div
                            className="
                            p-8
                            max-h-[70vh]
                            overflow-y-auto
                        "
                        >
                            {/* 1 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    1. Taraflar
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    İşbu sözleşme;
                                    <strong> SMK Filo </strong>
                                    ile araç kiralama hizmetinden yararlanan
                                    müşteri arasında elektronik ortamda
                                    düzenlenmiştir.
                                </p>
                            </div>

                            {/* 2 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    2. Hizmet Kapsamı
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    SMK Filo, bireysel ve kurumsal müşterilerine
                                    uzun dönem araç kiralama, filo yönetimi ve
                                    kilometre bazlı kullanım paketleri
                                    sunmaktadır. Rezervasyon sırasında seçilen
                                    araç, yıllık kullanım süresi, kilometre
                                    limiti ve toplam ücret müşteri tarafından
                                    onaylanır.
                                </p>
                            </div>

                            {/* 3 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    3. Rezervasyon ve Ödeme
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Rezervasyon işlemi ödeme onayı sonrasında
                                    kesinleşir. SMK Filo gerekli gördüğü
                                    durumlarda ek belge talep etme, rezervasyonu
                                    onaylama veya reddetme hakkını saklı tutar.
                                    Ödeme süreçleri kredi kartı, banka havalesi
                                    veya kurumsal ödeme yöntemleri ile
                                    gerçekleştirilebilir.
                                </p>
                            </div>

                            {/* 4 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    4. Kilometre Paketleri
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Müşteri, rezervasyon sırasında seçmiş olduğu
                                    kilometre limitine uygun kullanım
                                    gerçekleştireceğini kabul eder. Paket
                                    limitinin aşılması durumunda, aşım bedeli
                                    güncel fiyatlandırma politikası
                                    doğrultusunda ayrıca tahsil edilir. Ek
                                    kilometre paketleri rezervasyon öncesinde
                                    veya kiralama süresi boyunca satın
                                    alınabilir.
                                </p>
                            </div>

                            {/* 5 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    5. Araç Kullanım Koşulları
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Araçların trafik kurallarına uygun şekilde
                                    kullanılması müşterinin sorumluluğundadır.
                                    Araçların üçüncü kişilere izinsiz
                                    kullandırılması yasaktır. Kullanıcı, araçta
                                    oluşabilecek hasar, ihmal veya yanlış
                                    kullanım durumlarından sorumludur.
                                </p>
                            </div>

                            {/* 6 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    6. Bakım ve Servis
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Periyodik bakım süreçleri SMK Filo
                                    tarafından planlanmaktadır. Kullanıcı, bakım
                                    zamanı gelen araçlar için gerekli randevu
                                    süreçlerinde iş birliği yapmakla yükümlüdür.
                                </p>
                            </div>

                            {/* 7 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    7. İptal ve İade
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Rezervasyon iptal süreçleri, kampanya
                                    koşulları ve kiralama başlangıç tarihine
                                    göre farklılık gösterebilir. İade süreçleri
                                    ödeme yöntemine göre değişiklik
                                    gösterebilir.
                                </p>
                            </div>

                            {/* 8 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    8. Gizlilik ve Güvenlik
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Kullanıcı bilgileri KVKK kapsamında
                                    korunmakta olup üçüncü kişilerle
                                    paylaşılmamaktadır. SMK Filo, kullanıcı
                                    verilerini yalnızca hizmet süreçlerini
                                    yürütmek amacıyla kullanır.
                                </p>
                            </div>

                            {/* 9 */}
                            <div className="mb-8">
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    9. Mücbir Sebepler
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Doğal afet, savaş, salgın, grev, teknik
                                    altyapı sorunları ve benzeri olağanüstü
                                    durumlar mücbir sebep kapsamında
                                    değerlendirilir.
                                </p>
                            </div>

                            {/* 10 */}
                            <div>
                                <h3
                                    className="
                                    text-2xl
                                    font-bold
                                    text-orange-500
                                    mb-4
                                "
                                >
                                    10. Son Hükümler
                                </h3>

                                <p
                                    className="
                                    text-gray-700
                                    leading-loose
                                "
                                >
                                    Kullanıcı, bu sözleşmedeki tüm maddeleri
                                    okuduğunu, anladığını ve kabul ettiğini
                                    beyan eder. İşbu sözleşmeden doğabilecek
                                    uyuşmazlıklarda Türkiye Cumhuriyeti
                                    mahkemeleri yetkilidir.
                                </p>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div
                            className="
                            border-t
                            border-gray-200
                            px-8
                            py-6
                            flex
                            items-center
                            justify-between
                            flex-wrap
                            gap-4
                        "
                        >
                            <p
                                className="
                                text-gray-500
                                text-sm
                            "
                            >
                                © 2026 SMK Filo · Tüm hakları saklıdır.
                            </p>

                            <button
                                onClick={() => {
                                    setContractAccepted(true);

                                    setIsOpen(false);
                                }}
                                className="
                                    h-[52px]
                                    px-8
                                    rounded-2xl
                                    bg-orange-500
                                    hover:bg-orange-600
                                    text-white
                                    font-bold
                                    transition
                                "
                            >
                                {t("Sözleşmeyi Onayla")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RentalAgreementModal;
