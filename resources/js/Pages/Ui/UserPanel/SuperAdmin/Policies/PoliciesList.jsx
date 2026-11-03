import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePolicies } from "@/ServerSide/Hooks/usePolicies";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import SkeletonTable from "@/Pages/Ui/UserPanel/SuperAdmin/Seo/SkeletonTable.jsx";
import { setPolicies } from "@/Repo/Redux/Modules/PoliciesSlice";
import PoliciesModal from "./PoliciesModal.jsx";

const PoliciesList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { getPolicies, deletePolicy } = usePolicies();

    const { policies, loading, error } = useSelector(
        (state) => state.policies || {}
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    /** 🔹 Listeyi getir */
    const fetchData = async () => {
        try {
            const data = await getPolicies();
            dispatch(setPolicies(data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
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
                await deletePolicy(id);
                toast.success(t("Kayıt başarıyla silindi."));
                await fetchData();
            } catch (error) {
                console.error("❌ Silme hatası:", error);
                toast.error(t("Silme işlemi sırasında hata oluştu."));
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
            {/* 🔹 Üst Bar */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{t("Politikalar")}</h1>
                <button
                    onClick={() => {
                        setEditItem(null);
                        setModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {t("Yeni Politika Ekle")}
                </button>
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
                                <th className="p-3 border-b">{t("Ad")}</th>
                                <th className="p-3 border-b">{t("Tür (type)")}</th>
                                <th className="p-3 border-b text-center">{t("İşlemler")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(policies) && policies.length > 0 ? (
                                policies.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3 border-b">{item.name}</td>
                                        <td className="p-3 border-b text-gray-600">{item.type}</td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditItem(item);
                                                        setModalOpen(true);
                                                    }}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    {t("Düzenle")}
                                                </button>
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

            {/* 🔹 Modal */}
            {modalOpen && (
                <PoliciesModal
                    onClose={() => setModalOpen(false)}
                    editItem={editItem}
                    onRefresh={fetchData}
                />
            )}
        </div>
    );
};

export default PoliciesList;
