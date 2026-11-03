"use client";
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonNumber from "../../../../Components/UI/Misc/PersonNumber";
import ReservationDate from "../Misc/Reservation/ReservationDate";
import { toast } from "react-toastify";
import {
    setSelectedDates,
    setTotalNights,
    setTotalPrice,
    setPersonCount,
    makeReservation,
    initializeSession,
    setNightPrices,
    setCleaningFee,
    setCleaningDays,
    setSelectedPackage,
    setSelectedExtraKm,
} from "../../../../Repo/Redux/Modules/ReservationSlice";
import { ROUTES } from "../../../../Libs/Routes/config";
import { useKmPaketleri } from "../../../../ServerSide/Hooks/useKmPaketleri";
import { useTranslation } from "react-i18next";

const ReservationCard = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reservation = useSelector((state) => state.reservation);
    const [deliveryDate, setDeliveryDate] = useState(null);
    const { t } = useTranslation();
    const { fetchKmPackages } = useKmPaketleri();
    const extraKmPackages = useSelector(
        (state) => state.kmPaketleri.kmPackages,
    );
    const [personCount, setLocalPersonCount] = useState({
        adult: 2,
        child: 0,
        baby: 0,
    });
    const tursabNo =
        data?.details?.find((detail) => detail.key === "tursab_no")?.value ||
        null;
    useEffect(() => {
        if (reservation?.personCount) {
            setLocalPersonCount({
                adult: reservation.personCount.adult || 0,
                child: reservation.personCount.child || 0,
                baby: reservation.personCount.baby || 0,
            });
        }
    }, [reservation?.personCount]);

    const normalizeDate = (date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Temizlik ücretlerini belirle ve KM paketlerini çek
    useEffect(() => {
        fetchKmPackages();

        if (data && data.cleaning_fee) {
            dispatch(setCleaningFee(parseFloat(data.cleaning_fee) || 0));
        }

        if (data && data.cleaning_days) {
            dispatch(setCleaningDays(parseInt(data.cleaning_days) || 0));
        }
    }, [data, dispatch]);

    // Varsayılan paketi seç
    useEffect(() => {
        if (
            data?.prices &&
            data.prices.length > 0 &&
            !reservation.selectedPackage
        ) {
            dispatch(setSelectedPackage(data.prices[0]));
        }
    }, [data?.prices, reservation.selectedPackage, dispatch]);

    const handleDeliveryDateChange = (e) => {
        const dateStr = e.target.value;
        if (!dateStr) return;

        const date = new Date(dateStr);
        setDeliveryDate(dateStr);

        // Redux store'u güncelle (Backend için hem start hem end olarak gönderiyoruz)
        dispatch(
            setSelectedDates({
                start: date.toISOString(),
                end: date.toISOString(),
            }),
        );
    };

    // Paket seçimi Detail.jsx'e taşındı.

    const handleExtraKmSelect = (extraPkg) => {
        const newValue =
            reservation.selectedExtraKm?.id === extraPkg.id ? null : extraPkg;
        dispatch(setSelectedExtraKm(newValue));
    };





    const handleReservation = () => {
        if (!reservation.selectedDates.start) {
            toast.error(t("Lütfen araç teslim tarihini seçiniz."));
            return;
        }

        if (!reservation.selectedPackage) {
            toast.error(t("Lütfen bir paket seçiniz."));
            return;
        }

        try {
            dispatch(initializeSession());
            navigate(ROUTES.UI.RESERVATIION);
        } catch (error) {
            console.error("Rezervasyon yönlendirme hatası:", error);
            toast.error(t("Rezervasyon işlemi başlatılırken bir hata oluştu."));
        }
    };

    return (
        <div className="reservation-area">
            <div className="tourism-document">
                {/* <div className="card">
                    <img
                        src="/img/brand-logo/bakanlik.webp"
                        alt=""
                        width={50}
                        height={50}
                    />
                    <p>
                        Kültür ve Turizm Bakanlığı - Belge No:
                        <span className="fw-bold"> {tursabNo || '48-518'}</span>
                    </p>
                </div> */}
            </div>
            <div className="card">
                <h2>{t("Rezervasyon Oluştur")}</h2>

                {/* Seçili Paket Bilgisi */}
                <div className="selected-package-info mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("Seçili Yıllık Paket")}
                    </label>
                    {reservation.selectedPackage ? (
                        <div className="p-4 border-2 border-orange-500 bg-orange-50 rounded-xl">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">
                                    {reservation.selectedPackage.years} {t("Yıl")} ·{" "}
                                    {Number(reservation.selectedPackage.km).toLocaleString("tr-TR")} KM
                                </span>
                                <span className="text-orange-600 font-extrabold">
                                    {Number(reservation.selectedPackage.price).toLocaleString("tr-TR")} ₺
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * {t("Paket değişikliği için 'Yıllık Paketler' sekmesini kullanabilirsiniz.")}
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
                            <p className="text-sm text-gray-500 mb-2">
                                {t("Henüz bir paket seçmediniz.")}
                            </p>
                            <button 
                                type="button"
                                onClick={() => {
                                    const tabBtn = document.querySelector('[data-tab-id="packages"]');
                                    if (tabBtn) tabBtn.click();
                                }}
                                className="text-orange-600 font-bold text-sm hover:underline"
                            >
                                {t("Paketleri Görüntüle")}
                            </button>
                        </div>
                    )}
                </div>

                {/* Ek KM Paketi Seçimi (Dropdown) */}
                <div className="extra-km-selection mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("Ek KM Paketi")}
                    </label>
                    <select
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                        value={reservation.selectedExtraKm?.id || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (!val) {
                                dispatch(setSelectedExtraKm(null));
                                updateTotalPrice(reservation.selectedPackage, null);
                            } else {
                                const pkg = extraKmPackages.find(p => p.id.toString() === val);
                                if (pkg) handleExtraKmSelect(pkg);
                            }
                        }}
                    >
                        <option value="">{t("Ek KM Paketi İstemiyorum")}</option>
                        {extraKmPackages?.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                                +{Number(pkg.km).toLocaleString("tr-TR")} KM (+₺{Number(pkg.price).toLocaleString("tr-TR")})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Araç Teslim Tarihi Seçimi */}
                <div className="delivery-date-selection mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("Araç Teslim Tarihi")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={deliveryDate || ""}
                        onChange={handleDeliveryDateChange}
                        className={`w-full p-3 border rounded-xl focus:ring-orange-500 focus:border-orange-500 ${
                            !deliveryDate ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}
                    />
                    {!deliveryDate && (
                        <p className="text-xs text-red-500 mt-1">
                            {t("İşleme devam etmek için tarih seçmeniz zorunludur.")}
                        </p>
                    )}
                </div>

                <div className="flex hidden"></div>
                {/* <PersonNumber
                    personCount={personCount}
                    maxAdult={data?.max_adult || 10}
                    maxChild={data?.max_child || 4}
                    maxBaby={data?.max_baby || 2}
                    onPersonCountChange={handlePersonCountChange}
                /> */}

                <div className="auxiliary-buttons">
                    <button
                        type="button"
                        className="btn whatsapp-button"
                        onClick={() =>
                            window.open(
                                `https://wa.me/${data?.whatsapp || "905451926202"}`,
                                "_blank",
                            )
                        }
                    >
                        WhatsApp
                        <i className="whatsapp icon"></i>
                    </button>
                    <a
                        href={`tel:+${data?.phone || "05555555555"}`}
                        className="btn rezerve-call"
                    >
                        {data?.phone_display || "+905555555555"}
                        <i className="icon call"></i>
                    </a>
                </div>
                <div className="payment-total">
                    <ul>
                        <li className="flex justify-between">
                            <div>
                                <span className="night">
                                    {reservation.selectedPackage?.years}{" "}
                                    {t("Yıl")} {t("Paketi")}
                                </span>
                            </div>
                            <span className="total fw-bold">
                                ₺
                                {Number(
                                    reservation.selectedPackage?.price || 0,
                                ).toLocaleString("tr-TR")}
                            </span>
                        </li>
                        {reservation.selectedExtraKm && (
                            <li className="flex justify-between text-sm text-gray-600">
                                <span>
                                    +
                                    {Number(
                                        reservation.selectedExtraKm.km,
                                    ).toLocaleString("tr-TR")}{" "}
                                    KM Ek Paket
                                </span>
                                <span>
                                    +₺
                                    {Number(
                                        reservation.selectedExtraKm.price,
                                    ).toLocaleString("tr-TR")}
                                </span>
                            </li>
                        )}


                        {/* <li className="">
                            <div className="all-price flex justify-between">
                                Temizlik Ücreti
                                <span>
                                    ₺{(reservation.cleaningFee || 0).toLocaleString('tr-TR')}
                                </span>
                            </div>
                            {reservation.cleaningDays > 0 && (
                                <div className="all-price flex justify-between">
                                    Temizlik Ücreti Gün
                                    <span>
                                        {reservation.cleaningDays}
                                    </span>
                                </div>
                            )}
                        </li> */}
                        <li className="">
                            <div className="all-price flex justify-between">
                                {t("Toplam Tutar")}
                                <span className="total fw-bold">
                                    ₺
                                    {Number(
                                        reservation.totalPrice,
                                    ).toLocaleString("tr-TR")}
                                </span>
                            </div>
                        </li>
                    </ul>
                    <div className="button flex justify-center text-center">
                        <button
                            type="button"
                            className="btn make-reservation"
                            onClick={handleReservation}
                            disabled={
                                reservation.isSubmitting ||
                                !reservation.selectedPackage ||
                                !reservation.selectedDates.start
                            }
                        >
                            {reservation.isSubmitting
                                ? "İŞLEM YAPILIYOR..."
                                : "REZERVASYON YAP"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationCard;
