import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../Components/UI/Header/Header";
import ReservationForm from "./Misc/ReservationForm";
import PaymentCard from "./Misc/PaymentCard";
import { useTranslation } from "react-i18next";
import ImportantNote from "./Misc/Notes";
import RentalAgreementModal from "./Misc/Modal/RentalAgreement";
import CancellationConditionsModal from "./Misc/Modal/CancellationConditions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    initializeSession,
    extendOption,
    checkOptionStatus,
} from "../../../Repo/Redux/Modules/ReservationSlice";
import { useReservation } from "../../../ServerSide/Hooks/useReservation";

const Reservation = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [contractAccepted, setContractAccepted] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [remainingTime, setRemainingTime] = useState(300); // 5 dakika (300 saniye)
    const postDetail = useSelector((state) => state.post.detail);

    const reservation = useSelector((state) => state.reservation);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // Sayfa yüklendiğinde session başlat
    useEffect(() => {
        if (!reservation.sessionToken || !reservation.isOptionActive) {
            dispatch(initializeSession());
        }

        // Session timer'ını başlat
        const intervalId = setInterval(() => {
            dispatch(checkOptionStatus());

            // Kalan süreyi güncelle
            if (reservation.optionExpiryTime) {
                const secondsLeft = Math.max(
                    0,
                    Math.floor(
                        (reservation.optionExpiryTime - Date.now()) / 1000,
                    ),
                );
                setRemainingTime(secondsLeft);

                // 30 saniyeden az kaldığında ve kullanıcı aktifse süreyi uzat
                if (
                    secondsLeft < 30 &&
                    document.visibilityState === "visible" &&
                    reservation.isOptionActive
                ) {
                    extendOptionTime();
                }

                // Süre dolduysa ve hala aktif değilse yeniden başlat
                if (secondsLeft <= 0 && !reservation.isOptionActive) {
                    dispatch(initializeSession());
                    toast.info(
                        "Rezervasyon süreniz doldu, yeni bir süre başlatıldı.",
                    );
                }
            }
        }, 1000);

        // Component unmount olduğunda interval'i temizle
        return () => clearInterval(intervalId);
    }, [
        dispatch,
        reservation.sessionToken,
        reservation.optionExpiryTime,
        reservation.isOptionActive,
    ]);

    // Süreyi uzatan fonksiyon
    const extendOptionTime = async () => {
        try {
            dispatch(extendOption());

            // Eğer API isteği yapılacaksa:
            if (reservation.sessionToken) {
                await axios.post("/api/reservations/extend-option", {
                    session_token: reservation.sessionToken,
                });
                console.log("Opsiyon süresi uzatıldı");
            }
        } catch (error) {
            console.error("Opsiyon uzatma hatası:", error);
        }
    };

    // Kalan süreyi dakika:saniye formatında göster
    const formatRemainingTime = () => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const { createReservation } = useReservation();

    const handleProceedToPayment = async () => {
        /* 
        if (!contractAccepted || !termsAccepted) {
            toast.error(
                "Her iki sözleşmeyi de kabul etmeden devam edemezsiniz.",
            );
            return;
        }
        */

        try {
            const result = await createReservation(reservation); // redux verisini doğrudan gönder
            if (result && result.success) {
                Swal.fire({
                    title: t("Tebrikler!"),
                    text: t(
                        "Rezervasyon talebiniz bize ulaşmıştır. Müşteri temsilcimiz sizinle en kısa sürede iletişime geçecektir.",
                    ),
                    icon: "success",
                    confirmButtonText: t("Tamam"),
                    confirmButtonColor: "#f97316",
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (e) {
            console.error("Rezervasyon oluşturulurken hata:", e);
        }
    };

    return (
        <div className="reservation">
            <Header />

            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex flex-col my-6">
                <h1 className="text-xl font-bold mb-4">{t("Rezervasyon")}</h1>
                {/* <div className="text-red-500 font-bold">
                    {t("Tamamlamak için Kalan Süre:")} {formatRemainingTime()}{" "}
                    {t("dk")}
                </div> */}
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/3 px-3">
                        <div className="sticky">
                            {/* İlan Bilgileri */}
                            <div className="card bg-white rounded-lg shadow-sm p-6">
                                <div className="villa-image relative h-48 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={`${postDetail.cover?.media_url}`}
                                        alt={postDetail.cover?.media_alt}
                                        title={postDetail.cover?.media_title}
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="villa-info space-y-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {postDetail.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {postDetail.region.name}
                                        </p>
                                    </div>
                                    {/* <div className="flex justify-between py-4 border-t">
                                        <div className="text-center">
                                            <span className="block text-sm text-gray-600">{t('Giriş')}</span>
                                            <span className="font-medium">16.00</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-sm text-gray-600">{t('Çıkış')}</span>
                                            <span className="font-medium">10.00</span>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            {/* Rezervasyon Detay */}
                            <div className="card bg-white rounded-lg shadow-sm p-6 my-4">
                                <h3 className="text-lg font-semibold mb-4">
                                    {t("Rezervasyon Detayları")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <span className="text-gray-600 text-sm">
                                            {t("Seçilen Paket")}
                                        </span>
                                        <p className="font-medium">
                                            {reservation.selectedPackage
                                                ? `${reservation.selectedPackage.years} ${t("Yıllık")} · ${Number(reservation.selectedPackage.km).toLocaleString("tr-TR")} KM`
                                                : t("Paket seçilmedi")}
                                        </p>
                                        {reservation.selectedExtraKm && (
                                            <p className="text-sm text-orange-600 mt-1">
                                                +
                                                {Number(
                                                    reservation.selectedExtraKm
                                                        .km,
                                                ).toLocaleString("tr-TR")}{" "}
                                                KM {t("Ek Paket")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <span className="text-gray-600 text-sm">
                                            {t("Araç Alım Günü")}
                                        </span>
                                        <p className="font-medium">
                                            {reservation.selectedDates.start
                                                ? new Date(
                                                      reservation.selectedDates
                                                          .start,
                                                  ).toLocaleDateString(
                                                      "tr-TR",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : t("Tarih seçilmedi")}
                                        </p>
                                    </div>
                                    {/* <div className="bg-gray-100 p-4 rounded-lg">
                                        <span className="text-gray-600 text-sm">{t('Misafir')}</span>
                                        <p className="font-medium">
                                            {reservation.personCount.adult} {t('Yetişkin')}, {reservation.personCount.child} {t('Çocuk')}, {reservation.personCount.baby} {t('Bebek')}
                                        </p>
                                    </div> */}
                                    <div className="price-summary space-y-3 pt-4 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                {t("Paket Süresi")}
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    reservation.selectedPackage
                                                        ?.years
                                                }{" "}
                                                {t("Yıl")}
                                            </span>
                                        </div>
                                        {/* <div className="flex justify-between">
                                            <span className="text-gray-600">{t('Temizlik Ücreti')} ({t('Elden')})</span>
                                            <span className="font-medium">
                                                ₺{reservation.cleaningFee?.toLocaleString('tr-TR') || '0,00'}
                                            </span>
                                        </div> */}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                {t("Depozito")} ({t("Elden")})
                                            </span>
                                            <span className="font-medium">
                                                ₺
                                                {reservation.deposit?.toLocaleString(
                                                    "tr-TR",
                                                ) || "0,00"}
                                            </span>
                                        </div>
                                        {/* <div className="flex justify-between text-orange-500 font-medium">
                                            <span>
                                                {t("Ön Ödeme")} (%
                                                {reservation.prePaymentRate *
                                                    100}
                                                )
                                            </span>
                                            <span>
                                                ₺
                                                {Math.round(
                                                    reservation.totalPrice *
                                                        reservation.prePaymentRate,
                                                ).toLocaleString("tr-TR")}
                                            </span>
                                        </div> */}
                                        <div className="flex justify-between font-semibold pt-3 border-t">
                                            <span>{t("Paket Ücreti")}</span>
                                            <span>
                                                ₺
                                                {Number(
                                                    reservation.selectedPackage
                                                        ?.price || 0,
                                                ).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                        {reservation.selectedExtraKm && (
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>
                                                    {Number(
                                                        reservation
                                                            .selectedExtraKm.km,
                                                    ).toLocaleString(
                                                        "tr-TR",
                                                    )}{" "}
                                                    KM {t("Ek Paket")}
                                                </span>
                                                <span>
                                                    ₺
                                                    {Number(
                                                        reservation
                                                            .selectedExtraKm
                                                            .price,
                                                    ).toLocaleString("tr-TR")}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg pt-3 border-t">
                                            <span>{t("Toplam Tutar")}</span>
                                            <span>
                                                ₺
                                                {Number(
                                                    reservation.totalPrice,
                                                ).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3 px-3">
                        {/* Rezervasyon Formu */}
                        {!isAuthenticated && <ReservationForm />}
                        {/* Ödeme Seçeneği */}
                        {/* <PaymentCard /> */}
                        {/* Önemli Bilgiler */}
                        <ImportantNote />
                    </div>
                </div>

                <div className="bg-white border-t shadow-lg z-50 md:fixed md:bottom-0 md:left-0 md:right-0">
                    <div className="max-w-8xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
                        {/* 
                        <RentalAgreementModal
                            contractAccepted={contractAccepted}
                            setContractAccepted={setContractAccepted}
                        />
                        <CancellationConditionsModal
                            termsAccepted={termsAccepted}
                            setTermsAccepted={setTermsAccepted}
                        /> 
                        */}
                        <div className="flex flex-col text-center md:text-left">
                            <span className="text-gray-600 text-sm">
                                {t("Toplam Tutar")}
                            </span>
                            <span className="text-xl font-semibold">
                                ₺
                                {Number(
                                    reservation.totalPrice || 0,
                                ).toLocaleString("tr-TR")}
                            </span>
                        </div>

                        <button
                            onClick={handleProceedToPayment}
                             disabled={
                                // !contractAccepted ||
                                // !termsAccepted ||
                                !reservation.isOptionActive ||
                                reservation.isSubmitting
                            }
                            className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                                // contractAccepted &&
                                // termsAccepted &&
                                reservation.isOptionActive &&
                                !reservation.isSubmitting
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            {reservation.isSubmitting
                                ? t("İşleniyor...")
                                : t("Reservasyonu Tamamla")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;
