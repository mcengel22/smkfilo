import React, { useEffect } from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useBlog } from "../../../ServerSide/Hooks/useBlog";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../Libs/Routes/config";
import { API_CONFIG } from "../../../ServerSide/EndPoints";
const BlogListing = () => {
    const { t } = useTranslation();
    const { setBlogs } = useBlog();
    const blogs = useSelector((state) => state.home.blog.blogs);
    const BASE_URL = API_CONFIG.BASE_URL; // 🔥 endpoint config'ten alıyoruz
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                await setBlogs();
            } catch (error) {
                console.error("Bloglar yüklenemedi:", error);
            }
        };
        fetchBlogs();
    }, []);

    // HTML etiketlerini temizleyip kısa özet oluşturan fonksiyon
    const getSummary = (html, maxLength = 140) => {
        const div = document.createElement("div");
        div.innerHTML = html || "";
        const text = div.textContent || div.innerText || "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <>
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* 🔹 Başlık */}
                <div className="mb-8 text-center">
                    <h3 className="text-3xl font-extrabold text-blue-600 drop-shadow-sm">
                        📝 {t("Blog Yazıları")}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {t("Bilgilendirici ve ilgi çekici içerikleri keşfet!")}
                    </p>
                </div>

                {/* 🔹 Blog Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(blogs) && blogs.length > 0 ? (
                        blogs.map((item) => {
                            const imgSrc =
                                item.image && item.image.startsWith("http")
                                    ? item.image
                                    : `${BASE_URL}${item.image || ""}`;
                            const contentPreview = getSummary(item.content, 140);
                            const blogLink = `${ROUTES.UI.BLOG_DETAIL}/${item.slug}`;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 overflow-hidden flex flex-col group"
                                >
                                    {/* 📸 Görsel */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={imgSrc || "/img/default.jpg"}
                                            alt={item.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        {item.type && (
                                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        🏷️ {item.type}
                      </span>
                                        )}
                                    </div>

                                    {/* 📝 İçerik */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            <Link to={blogLink}>{item.title}</Link>
                                        </h2>

                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                                            {contentPreview}
                                        </p>

                                        <Link
                                            to={blogLink}
                                            className="text-blue-600 font-semibold hover:text-blue-800 text-sm mt-auto inline-flex items-center gap-1"
                                        >
                                            {t("📖 Devamını Oku")}
                                            <i className="icon chevron-right text-xs"></i>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-12 text-center text-gray-500 py-10">
                            {t("Herhangi bir blog bulunamadı.")}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogListing;
