import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { useFaq } from "../../../../../ServerSide/Hooks/useFaq";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import PaginationNavigator from "../../../../../Components/UI/Misc/PaginationNavigator";
import SkeletonTable from "@/Pages/Ui/UserPanel/SuperAdmin/Seo/SkeletonTable.jsx";
import { changePage } from "../../../../../Repo/Redux/Modules/FilterSlice";

const FaqList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { setFaqs, deleteFaq } = useFaq();

    const faqs = useSelector((state) => state.home.faq.faqs);
    const pagination = useSelector((state) => state.home.faq.pagination);
    const loading = useSelector((state) => state.home.faq.loading);
    const error = useSelector((state) => state.home.faq.error);
    const { filters } = useSelector((state) => state.filter || { filters: {} });

    const [searchTerm, setSearchTerm] = useState("");

    const fetchFaqs = async (filters = {}) => {
        try {
            const paginationParams = filters.pagination || {
                pageNumber: 1,
                perPage: 10,
                pName: "page",
            };

            const sortParams = filters.sort || {
                by: "id",
                direction: "desc",
            };

            const combinedFilters = {
                pagination: paginationParams,
                sort: sortParams,
                search: searchTerm,
            };

            const data = await setFaqs(combinedFilters);
        } catch (err) {
            console.error("❌ SSS verisi alınamadı:", err);
        }
    };

    useEffect(() => {
        fetchFaqs({});
    }, []);

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            fetchFaqs(filters);
        }
    }, [filters]);

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
                await deleteFaq(id);
                toast.success(t("SSS kaydı başarıyla silindi!"));
                await fetchFaqs(filters);
            } catch (error) {
                console.error("❌ Silme hatası:", error);
                Swal.fire(t("Hata!"), t("Silme işlemi sırasında bir sorun oluştu."), "error");
            }
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchFaqs(filters);
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
            <div className="card-header flex justify-end items-center p-4 border-b">
                <Link
                    to={ROUTES.UI.FAQADD}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    <span>{t("Yeni SSS Kaydı")}</span>
                </Link>
            </div>

            {/* 🔹 Tablo */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border">
                {loading ? (
                    <SkeletonTable />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-3 border-b">{t("Soru")}</th>
                                <th className="p-3 border-b">{t("Cevap")}</th>
                                <th className="p-3 border-b">{t("Durum")}</th>
                                <th className="p-3 border-b">{t("Tarih")}</th>
                                <th className="p-3 border-b text-center">{t("İşlemler")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(faqs) && faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <tr key={faq.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3 border-b">{faq.question || "-"}</td>
                                        <td className="p-3 border-b text-gray-700 truncate max-w-[300px]">
                                            {faq.answer || "-"}
                                        </td>
                                        <td className="p-3 border-b">
                                            {faq.status === "active" ? (
                                                <span className="text-green-600 font-medium">{t("Aktif")}</span>
                                            ) : (
                                                <span className="text-gray-500">{t("Pasif")}</span>
                                            )}
                                        </td>
                                        <td className="p-3 border-b text-gray-500">
                                            {faq.created_at || "-"}
                                        </td>
                                        <td className="p-3 border-b text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`${ROUTES.UI.FAQEDIT}/${faq.id}`}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                                >
                                                    {t("Düzenle")}
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(faq.id)}
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
                                    <td colSpan="5" className="text-center py-6 text-gray-500">
                                        {t("Kayıt bulunamadı.")}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pagination && (
                <div className="mt-4">
                    <PaginationNavigator pagination={pagination} />
                </div>
            )}
        </div>
    );
};

export default FaqList;
