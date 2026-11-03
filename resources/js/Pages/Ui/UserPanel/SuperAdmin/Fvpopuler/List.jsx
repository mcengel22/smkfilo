import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { usePopulerregion } from "../../../../../ServerSide/Hooks/usePopulerregion";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import SkeletonTable from "@/Pages/Ui/UserPanel/SuperAdmin/Seo/SkeletonTable.jsx";
import { changePage } from "../../../../../Repo/Redux/Modules/FilterSlice";

const FvList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { setPopulerregions, deletePopulerregion } = usePopulerregion();

    // ✅ Doğru state yolu (home.populerregion)
    const populerregions = useSelector(
        (state) => state.home.populerregion?.populerregions || []
    );
    const loading = useSelector(
        (state) => state.home.populerregion?.loading || false
    );
    const error = useSelector(
        (state) => state.home.populerregion?.error || null
    );

    // 🔹 Verileri çek
    useEffect(() => {
        setPopulerregions();
    }, []);

    /** 🔹 Silme işlemi */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t("Emin misiniz?"),
            text: t("Bu işlem geri alınamaz!"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("Evet, sil!"),
            cancelButtonText: t("İptal"),
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deletePopulerregion(id);
                toast.success(t("Kayıt başarıyla silindi."));
                await setPopulerregions(); // ✅ Listeyi yenile
            } catch (error) {
                console.error("❌ Silme hatası:", error);
                toast.error(t("Silme işlemi sırasında hata oluştu."));
            }
        }
    };

    // 🔹 Hata durumu
    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {t("Bir hata oluştu")}: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* 🔹 Üst Bar */}
            <div className="card-header flex justify-end items-center p-4 border-b">
                <Link
                    to={ROUTES.UI.FVREGIONADD}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    <span>{t("Yeni Popüler Bölge Ekle")}</span>
                </Link>
            </div>

            {/* 🔹 Tablo */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border mt-4">
                {loading ? (
                    <SkeletonTable />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-3 border-b">{t("Bölge")}</th>
                                <th className="p-3 border-b">{t("Slug")}</th>
                                <th className="p-3 border-b text-center">{t("İşlemler")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(populerregions) && populerregions.length > 0 ? (
                                populerregions.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3 border-b">
                                            {item.region?.name || "-"}
                                        </td>
                                        <td className="p-3 border-b text-gray-600">
                                            {item.slug || "-"}
                                        </td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`${ROUTES.UI.FVREGIONEDIT}/${item.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    {t("Düzenle")}
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                                    <td
                                        colSpan="4"
                                        className="text-center py-6 text-gray-500"
                                    >
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

export default FvList;
