import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { useSeo } from "../../../../../ServerSide/Hooks/useSeo";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import PaginationNavigator from "../../../../../Components/UI/Misc/PaginationNavigator";
import SkeletonTable from "./SkeletonTable";
import { changePage } from "../../../../../Repo/Redux/Modules/FilterSlice";

const SeoList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { setSeos, deleteSeo } = useSeo();

    const seos = useSelector((state) => state.seo.seos);
    const pagination = useSelector((state) => state.seo.pagination);
    const loading = useSelector((state) => state.seo.loading);
    const { filters } = useSelector((state) => state.filter);

    const [searchTerm, setSearchTerm] = useState("");

    // 🔹 SEO verilerini çek
    const fetchSeos = async (filters = {}) => {
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

            const data = await setSeos(combinedFilters);
            console.log("📦 FETCHED SEO DATA:", data);
        } catch (err) {
            console.error("SEO verisi alınamadı:", err);
        }
    };

    // 🧭 İlk yükleme
    useEffect(() => {
        fetchSeos({});
    }, []);

    // 🧭 Filtre değişince tekrar çek
    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            fetchSeos(filters);
        }
    }, [filters]);

    // 🔹 Silme işlemi
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
                await deleteSeo(id);

                await fetchSeos(filters);
            } catch (error) {
                console.error("Silme hatası:", error);
                Swal.fire(t("Hata!"), t("Silme işlemi sırasında bir sorun oluştu."), "error");
            }
        }
    };

    // 🔹 Arama işlemi
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchSeos(filters);
    };

    // 🔍 Log: Redux state'lerini gözlemle
    console.log("🧩 SEO STATE:", seos);
    console.log("🧮 PAGINATION STATE:", pagination);
    console.log("⏳ LOADING STATE:", loading);

    return (
        <div>
            <div className="title">
                <h1>{t("SEO Kayıtları")}</h1>
            </div>

            <div className="card">
                <div className="card-header flex justify-between items-center">
                    <form onSubmit={handleSearchSubmit} className="search-box">
                        <i className="icon search"></i>
                        <input
                            type="text"
                            placeholder={t("Başlık veya açıklama ile ara...")}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" style={{ display: "none" }}></button>
                    </form>

                    <Link to={ROUTES.UI.SEOADD} className="btn btn-primary add-user-btn">
                        <span>{t("Yeni SEO Kaydı")}</span>
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive table-area">
                        {loading ? (
                            <SkeletonTable />
                        ) : (
                            <table>
                                <thead>
                                <tr>
                                    <th>{t("Ana Başlık")}</th>
                                    <th>{t("Ana Açıklama")}</th>
                                    <th>{t("Tür")}</th>
                                    <th>{t("Bölge")}</th>
                                    <th>{t("Canonical URL")}</th>
                                    <th>{t("İşlemler")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(seos) && seos.length > 0 ? (
                                    seos.map((seo) => (
                                        <tr key={seo.id}>
                                            <td>{seo.main_title || "-"}</td>
                                            <td className="max-w-[250px] truncate">
                                                {seo.main_description || "-"}
                                            </td>
                                            <td>{seo.type || "-"}</td>
                                            <td>{seo.region?.name || "-"}</td>
                                            <td className="truncate max-w-[200px]">
                                                {seo.canonical_url || "-"}
                                            </td>


                                            <td className="actions">
                                                <div className="flex">
                                                    <Link
                                                        to={`${ROUTES.UI.SEOEDIT}/${seo.id}`}
                                                        className="btn-icon"
                                                        title={t("Düzenle")}
                                                    >
                                                        <i className="icon edit"></i>
                                                    </Link>

                                                    <button
                                                        className="btn-icon delete"
                                                        title={t("Sil")}
                                                        onClick={() => handleDelete(seo.id)}
                                                    >
                                                        <i className="icon trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">
                                            {t("Kayıt bulunamadı.")}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {pagination && (
                    <div className="card-footer">
                        <PaginationNavigator pagination={pagination} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeoList;
