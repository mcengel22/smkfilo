import React, { useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Transfer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const pdfRef = useRef(null);

    const reservation = useSelector((state) => state.reservation);
    const posts = useSelector((state) => state.post);
    const payment = useSelector((state) => state.payment);

    if (
        !reservation?.nightPrices?.length ||
        !posts?.detail ||
        !payment?.reservationId
    ) {
        return (
            <div className="text-center py-20 text-lg text-gray-700">
                Yükleniyor...
            </div>
        );
    }

    const checkInDate = useMemo(
        () => reservation?.nightPrices?.[0]?.date || "",
        [reservation],
    );
    const checkOutDate = useMemo(
        () =>
            reservation?.nightPrices?.[reservation?.nightPrices?.length - 1]
                ?.date || "",
        [reservation],
    );

    const villa = {
        name: posts?.detail?.title || "",
        location: posts?.detail?.region?.name || "",
        image: posts?.detail?.cover?.media_url || "", // ⚠️ Eğer cover doğrudan URL ise `cover` yazman yeterli
    };

    const dates = {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: reservation.totalNights || 0,
        checkInTime: posts?.detail?.details?.key?.check_in || "14:00",
        checkOutTime: posts?.detail?.details?.key?.check_out || "11:00",
    };

    const guests = {
        adults: reservation.personCount?.adult || 0,
        children: reservation.personCount?.child || 0,
        infant: reservation.personCount?.baby || 0,
    };

    const prices = {
        deposit: reservation.deposit || 0,
        cleaning: reservation.cleaningFee || 0,
        total: reservation.paymentInfo?.amount || 0,
        prepayment_percentage: (reservation.prePaymentRate || 0) * 100,
    };

    const reservation_number = payment?.reservationId || "RES-000000";

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            minimumFractionDigits: 2,
        }).format(amount);

    const handleDownloadPDF = () => {
        if (pdfRef.current) {
            toPng(pdfRef.current, { quality: 1 })
                .then((dataUrl) =>
                    saveAs(dataUrl, `reservation-${reservation_number}.png`),
                )
                .catch((error) => {
                    console.error("PDF oluşturulurken hata oluştu:", error);
                });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                ref={pdfRef}
            >
                {/* 📷 Villa */}
                <div className="relative mb-6">
                    <img
                        src={villa.image}
                        alt={villa.name}
                        className="rounded-lg border-4 border-gray-200 shadow-md mx-auto w-[300px] h-[150px] object-cover"
                    />
                    <h2 className="mt-2 text-lg font-semibold text-gray-800">
                        {villa.name}
                    </h2>
                </div>

                {/* 🧾 Başlık + Mesaj */}
                <h2 className="text-xl font-semibold text-gray-800">
                    Merhaba,{" "}
                    <span className="font-bold text-orange-500">Misafir</span>
                </h2>

                <p className="text-gray-700 mt-4 leading-relaxed">
                    Rezervasyonunuz başarıyla alındı! <br /> En kısa sürede
                    sizinle iletişime geçeceğiz.
                </p>

                {/* 🗓️ Tarihler */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-lg font-medium text-gray-800">
                        {dates.checkIn} ({dates.checkInTime}) <br />→<br />{" "}
                        {dates.checkOut} ({dates.checkOutTime})
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        Gece: {dates.nights}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Lokasyon: {villa.location}
                    </p>
                </div>

                {/* 👥 Misafirler */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-lg font-medium text-gray-800">
                        Misafirler
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                        Yetişkin: {guests.adults}, Çocuk: {guests.children},
                        Bebek: {guests.infant}
                    </p>
                </div>

                {/* 💸 Ödeme */}
                <div className="mt-6 p-4 bg-orange-100 border border-orange-300 rounded-lg">
                    <p className="text-lg font-semibold text-orange-600">
                        Ödeme Detayları
                    </p>
                    <p className="text-gray-800 text-sm">
                        Depozito: {formatCurrency(prices.deposit)}
                    </p>
                    <p className="text-gray-800 text-sm">
                        Temizlik Ücreti: {formatCurrency(prices.cleaning)}
                    </p>
                    <p className="text-gray-900 font-bold">
                        Ön Ödeme Fiyat: {formatCurrency(prices.total)}
                    </p>

                    {/* 📝 Açıklama */}
                    <p className="text-xs text-gray-600 mt-2 italic">
                        Ön ödemenin haricindeki kalan tutar, konaklama
                        başlangıcında tahsil edilecektir.
                    </p>
                </div>

                {/* ✅ Rez. Kodu */}
                <div className="mt-6 p-4 bg-orange-100 border border-orange-300 rounded-lg">
                    <p className="text-lg font-semibold text-orange-600">
                        Rezervasyon Kodu
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {reservation_number}
                    </p>
                    <span className="text-sm text-gray-600 block mt-1">
                        Lütfen bu kodu kaydedin
                    </span>
                </div>

                {/* 🔘 Butonlar */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => {
                            navigate("/");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all"
                    >
                        Anasayfaya Dön
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all"
                    >
                        PDF Olarak İndir
                    </button>
                </div>
            </div>
        </div>
    );
}
