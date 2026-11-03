import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { useBlog } from "../../../../../ServerSide/Hooks/useBlog";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import PaginationNavigator from "../../../../../Components/UI/Misc/PaginationNavigator";
import SkeletonTable from "./SkeletonTable";
import { changePage } from "../../../../../Repo/Redux/Modules/FilterSlice";

const BlogList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { setBlogs, deleteBlog } = useBlog();

    const blogs = useSelector((state) => state.blog.blogs);
    const pagination = useSelector((state) => state.blog.pagination);
    const loading = useSelector((state) => state.blog.loading);
    const { filters } = useSelector((state) => state.filter);

    const [searchTerm, setSearchTerm] = useState("");

    // 🔹 Blog verilerini çek
    const fetchBlogs = async (filters = {}) => {
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

            const data = await setBlogs(combinedFilters);
            console.log("📦 FETCHED BLOG DATA:", data);
        } catch (err) {
            console.error("Blog verisi alınamadı:", err);
        }
    };

    // 🧭 İlk yükleme
    useEffect(() => {
        fetchBlogs({});
    }, []);

    // 🧭 Filtre değişince tekrar çek
    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            fetchBlogs(filters);
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
                await deleteBlog(id);

                await fetchBlogs(filters);
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
        fetchBlogs(filters);
    };

    // 🔍 Log: Redux state'lerini gözlemle
    console.log("🧩 BLOG STATE:", blogs);
    console.log("🧮 PAGINATION STATE:", pagination);
    console.log("⏳ LOADING STATE:", loading);

    return (
        <div>
            <div className="title mb-4">
                <h1 className="text-2xl font-bold">{t("Blog Kayıtları")}</h1>
            </div>

            <div className="card bg-white shadow-md rounded-lg">
                <div className="card-header flex justify-between items-center p-4 border-b">
                    <form onSubmit={handleSearchSubmit} className="search-box flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={t("Başlık veya içerik ile ara...")}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border rounded p-2 w-64"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {t("Ara")}
                        </button>
                    </form>

                    <Link
                        to={ROUTES.UI.BLOGADD}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <span>{t("Yeni Blog Kaydı")}</span>
                    </Link>
                </div>

                <div className="card-body p-4">
                    <div className="table-responsive">
                        {loading ? (
                            <SkeletonTable />
                        ) : (
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 border-b">{t("Başlık")}</th>
                                    <th className="p-2 border-b">{t("Tür")}</th>
                                    <th className="p-2 border-b">{t("Bölge")}</th>
                                    <th className="p-2 border-b">{t("Slug")}</th>
                                    <th className="p-2 border-b">{t("Görsel")}</th>
                                    <th className="p-2 border-b">{t("Tarih")}</th>
                                    <th className="p-2 border-b">{t("İşlemler")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(blogs) && blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-gray-50">
                                            <td className="p-2 border-b">{blog.title || "-"}</td>
                                            <td className="p-2 border-b">{blog.type || "-"}</td>
                                            <td className="p-2 border-b">{blog.region_name || "-"}</td>
                                            <td className="p-2 border-b truncate max-w-[150px]">
                                                {blog.slug || "-"}
                                            </td>
                                            <td className="p-2 border-b">
                                                {blog.image ? (
                                                    <img
                                                        src={blog.image}
                                                        alt="cover"
                                                        className="w-16 h-10 object-cover rounded"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-2 border-b text-gray-500">
                                                {blog.created_at || "-"}
                                            </td>
                                            <td className="p-2 border-b">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`${ROUTES.UI.BLOGEDIT}/${blog.slug}`}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        {t("Düzenle")}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(blog.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
                                            colSpan="7"
                                            className="text-center py-4 text-gray-500"
                                        >
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
                    <div className="card-footer p-4 border-t">
                        <PaginationNavigator pagination={pagination} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
