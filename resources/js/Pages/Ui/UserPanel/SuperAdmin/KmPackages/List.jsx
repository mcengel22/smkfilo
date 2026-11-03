import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { useKmPaketleri } from "../../../../../ServerSide/Hooks/useKmPaketleri";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import SkeletonTable from "@/Pages/Ui/UserPanel/SuperAdmin/Seo/SkeletonTable.jsx";

const KmPackagesList = () => {
    const { t } = useTranslation();
    const { fetchKmPackages, deleteKmPackage } = useKmPaketleri();

    const kmPackages = useSelector((state) => state.kmPaketleri.kmPackages);
    const loading = useSelector((state) => state.kmPaketleri.loading);
    const error = useSelector((state) => state.kmPaketleri.error);

    useEffect(() => {
        fetchKmPackages();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t("Emin misiniz?"),
            text: t("Bu işlem geri alınamaz!"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("Evet, sil!"),
            cancelButtonText: t("Hayır, iptal et!"),
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deleteKmPackage(id);
                toast.success(t("Km paketi başarıyla silindi!"));
            } catch (error) {
                console.error("❌ Silme hatası:", error);
                Swal.fire(t("Hata!"), t("Silme işlemi sırasında bir sorun oluştu."), "error");
            }
        }
    };

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {t("Bir hata oluştu")}: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t("Km Paketleri")}</h2>
                <Link
                    to={ROUTES.UI.KM_PACKAGES_ADD}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <span>{t("Yeni Km Paketi Ekle")}</span>
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border">
                {loading ? (
                    <SkeletonTable />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-3 border-b">{t("Kilometre")}</th>
                                <th className="p-3 border-b">{t("Fiyat")}</th>
                                <th className="p-3 border-b">{t("Tarih")}</th>
                                <th className="p-3 border-b text-center">{t("İşlemler")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(kmPackages) && kmPackages.length > 0 ? (
                                kmPackages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3 border-b font-medium">{pkg.km} km</td>
                                        <td className="p-3 border-b">{pkg.price} TL</td>
                                        <td className="p-3 border-b text-gray-500">
                                            {pkg.created_at || "-"}
                                        </td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`${ROUTES.UI.KM_PACKAGES_EDIT}/${pkg.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    {t("Düzenle")}
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    {t("Sil")}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        {t("Kayıt bulunamadı.")}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KmPackagesList;
