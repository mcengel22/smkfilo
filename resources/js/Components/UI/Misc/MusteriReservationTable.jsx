import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Skeleton from "@/Components/Skeleton.jsx";

const MusteriReservationTable = ({ reservations }) => {
    const { t } = useTranslation();
    const isLoading = useSelector((state) => state.post.loading);
    const user = useSelector((state) => state.auth.user);

    // Durum meta bilgileri
    const statusMeta = useMemo(
        () => ({
            pending: {
                label: t("Onay Bekliyor"),
                className: "bekleyen",
                style: { backgroundColor: "#ff9800", color: "white" },
            },
            confirmed: {
                label: t("Onaylandı"),
                className: "onayli",
                style: { backgroundColor: "#4caf50", color: "white" },
            },
            cancelled: {
                label: t("İptal Edildi"),
                className: "iptal",
                style: { backgroundColor: "#f44336", color: "white" },
            },
        }),
        [t],
    );

    // Admin için müşteri gizleme fonksiyonu
    const getCustomerInfo = (res) => {
        const isAdmin = user?.type === "admin";

        if (isAdmin && res.status !== "confirmed") {
            return {
                name: t(" Gizli "),
                phone: t(" Gizli "),
            };
        }

        return res.customer;
    };

    return (
        <div className="tablo-container">
            <table className="rezervasyon-tablosu">
                <thead>
                    <tr>
                        <th>{t("Rezervasyon No")}</th>
                        <th>{t("Müşteri Bilgileri")}</th>
                        <th>{t("Tarih")}</th>
                        <th>{t("İlan Bilgileri")}</th>
                        <th>{t("Temizlik Ücreti")}</th>
                        <th>{t("Depozit")}</th>
                        <th>{t("Tutar")}</th>
                        <th>{t("Durum")}</th>
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {Array.from({ length: 8 }).map((__, j) => (
                                    <td key={j}>
                                        <Skeleton height="80px" width="99px" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <>
                            {reservations && reservations.length > 0 ? (
                                reservations.map((res) => {
                                    const s = statusMeta[res.status] || {};
                                    const customer = getCustomerInfo(res);

                                    return (
                                        <tr key={res.id}>
                                            <td className="rezervasyon-no text-sm">
                                                {res.code}
                                            </td>

                                            <td>
                                                <div className="musteri-bilgileri">
                                                    <div className="musteri-adi font-semibold">
                                                        {customer.name}
                                                    </div>
                                                    <div className="iletisim">
                                                        <span className="telefon text-sm">
                                                            {customer.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="tarih-bilgileri">
                                                    <span className="giris">
                                                        {t("Giriş:")}{" "}
                                                        {new Date(
                                                            res.dateRange.start,
                                                        ).toLocaleDateString(
                                                            "tr-TR",
                                                        )}
                                                    </span>
                                                    <span className="cikis">
                                                        {t("Çıkış:")}{" "}
                                                        {new Date(
                                                            res.dateRange.end,
                                                        ).toLocaleDateString(
                                                            "tr-TR",
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="villa-bilgileri">
                                                    <div className="villa-adi font-semibold">
                                                        {res.post.title}
                                                    </div>
                                                    <div className="detaylar">
                                                        <span>
                                                            {res.post.region}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="text-sm">
                                                    {res.cleaningFee}₺
                                                </span>
                                            </td>

                                            <td>
                                                <span>{res.deposit}₺</span>
                                            </td>

                                            <td className="toplam-tutar">
                                                {res.totalPrice}₺
                                            </td>

                                            <td>
                                                <span
                                                    className={`durum-badge ${s.className}`}
                                                    style={s.style}
                                                >
                                                    {s.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-4"
                                    >
                                        {t("Hiç rezervasyon bulunamadı.")}
                                    </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MusteriReservationTable;
