import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Skeleton from "../../../Components/Skeleton";
import { useReservation } from "../../../ServerSide/Hooks/useReservation";
import { useSelector } from "react-redux";
import { ROUTES } from "../../../Libs/Routes/config";
import EditReservationModal from "./EditReservationModal";

const ReservationTable = ({ reservations, onStatusUpdate, onDelete }) => {
    const { t } = useTranslation();
    const isLoading = useSelector((state) => state.post.loading);
    const { confirmReservation, cancelReservation, deleteReservation } = useReservation();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const [updatingId, setUpdatingId] = useState(null);

    const statusMeta = useMemo(
        () => ({
            pending: { text: t("Bekliyor"), className: "bg-yellow-200 text-yellow-800" },
            confirmed: { text: t("Onaylandı"), className: "bg-green-200 text-green-800" },
            canceled: { text: t("Reddedildi"), className: "bg-red-200 text-red-800" },
        }),
        [t]
    );


    const handleConfirm = async (id) => {
        setUpdatingId(id);
        try {
            const { data: updated } = await confirmReservation(id);
            onStatusUpdate(updated);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t("Bu rezervasyonu silmek istediğinize emin misiniz?"))) return;

        setUpdatingId(id);

        try {
            await deleteReservation(id);
            onDelete(id); // ✔ sadece ID gönderiyoruz
        } finally {
            setUpdatingId(null);
        }
    };



    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
        setEditModalOpen(true);
    };

    return (
        <div className="table-responsive table-area">
            <table>
                <thead>
                <tr>
                    <th>{t("Rezervasyon No")}</th>
                    <th>{t("Tarih")}</th>
                    <th>{t("İlan Adı")}</th>
                    <th>{t("Müşteri")}</th>
                    <th>{t("Paket Detayı")}</th>
                    <th>{t("Toplam Fiyat")}</th>
                    <th>{t("Bağlantı Linki")}</th>
                    <th>{t("Durum")}</th>
                    {/* ❌ Zaman sütunu kaldırıldı */}
                    <th>{t("İşlemler")}</th>
                </tr>
                </thead>

                <tbody>
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            {Array.from({ length: 9 }).map((__, j) => (
                                <td key={j}>
                                    <Skeleton height="30px" width="150px" />
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <>
                        {reservations?.map((res) => (
                            <tr key={res.id}>
                                <td> {res.code}</td>

                                <td>
                                    {res.startDate?.slice(0, 10)} <br />
                                    {res.endDate?.slice(0, 10)}
                                </td>

                                <td>{res.title}</td>
                                <td>{res.customer}({res.customerPhone})</td>
                                <td>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{res.packageInfo}</div>
                                        <div className="text-orange-600">
                                            {res.extraKmInfo 
                                                ? `${res.extraKmInfo.replace('Ek Paket', '').trim()} ${t('istiyor')}` 
                                                : t("Ekstra paket istemiyor")}
                                        </div>
                                    </div>
                                </td>
                                <td>{res.price}</td>

                                <td>
                                    <Link to={`${ROUTES.UI.DETAIL}/${res.slug}`}>
                                        {t("Detay")}
                                    </Link>
                                </td>

                                <td>
                                    {res.id === updatingId ? (
                                        <Skeleton height="20px" width="100px" />
                                    ) : (
                                        <div
                                            className={`px-3 py-2 rounded-full text-xs font-semibold ${
                                                statusMeta[res.status]?.className
                                            }`}
                                        >
                                            {statusMeta[res.status]?.text || res.status}
                                        </div>
                                    )}
                                </td>

                                {/* ❌ Zaman hücresi tamamen kaldırıldı */}

                                <td>
                                    {res.id === updatingId ? (
                                        <Skeleton height="20px" width="150px" />
                                    ) : (
                                        <div className="flex space-x-2">

                                            {res.status === "pending" ? (
                                                <>
                                                    {/*<button*/}
                                                    {/*    onClick={() => handleCancel(res.id)}*/}
                                                    {/*    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-xs"*/}
                                                    {/*>*/}
                                                    {/*    {t("Reddet")}*/}
                                                    {/*</button>*/}
                                                    <button
                                                        onClick={() => handleConfirm(res.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-xs"
                                                    >
                                                        {t("Onayla")}
                                                    </button>
                                                </>
                                            // ) : res.status === "confirmed" ? (
                                            //     <button
                                            //         onClick={() => handleCancel(res.id)}
                                            //         className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-xs"
                                            //     >
                                            //         {t("İptal Et")}
                                            //     </button>
                                            )
                                                : null}

                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-xs"
                                            >
                                                {t("Sil")}
                                            </button>

                                            <button
                                                onClick={() => handleEdit(res)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-xs"
                                            >
                                                {t("Düzenle")}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {(!reservations || reservations.length === 0) && (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    {t("Hiç rezervasyon bulunamadı.")}
                                </td>
                            </tr>
                        )}
                    </>
                )}
                </tbody>
            </table>

            {editModalOpen && (
                <EditReservationModal
                    reservation={selectedReservation}
                    onClose={() => setEditModalOpen(false)}
                    onUpdated={onStatusUpdate}
                />
            )}
        </div>
    );
};

export default ReservationTable;
