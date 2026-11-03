import React, { useEffect, useState } from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useBlog } from "../../../ServerSide/Hooks/useBlog";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const BlogDetail = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const { getBlog } = useBlog();
    const blog = useSelector((state) => state.home.blog.blog);

    const [seoData, setSeoData] = useState(null);

    const FALLBACK_SEO = {
        meta_title: "Araç Kiralama",
        meta_description: "Araç Kiralama.",
        keywords: "arac kiralama",
        canonical_url:
            typeof window !== "undefined" ? window.location.href : "",
        image: "/img/smkfavicon.png",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getBlog(slug);
            } catch (error) {
                console.error("Blog detayı alınamadı:", error);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (blog) {
            const baseUrl = window.location.origin;
            const imageUrl =
                blog.image && blog.image.startsWith("http")
                    ? blog.image
                    : `${baseUrl.replace(/\/$/, "")}${blog.image?.startsWith("/") ? "" : "/"}${blog.image || ""}`;

            setSeoData({
                meta_title: blog.title || FALLBACK_SEO.meta_title,
                meta_description:
                    blog.short_description ||
                    blog.content?.replace(/<[^>]+>/g, "").substring(0, 160) ||
                    FALLBACK_SEO.meta_description,
                keywords: Array.isArray(blog.keywords)
                    ? blog.keywords.join(", ")
                    : blog.keywords || FALLBACK_SEO.keywords,
                canonical_url: blog.canonical_url || FALLBACK_SEO.canonical_url,
                image: imageUrl || FALLBACK_SEO.image,
            });
        }
    }, [blog]);

    if (!blog) {
        return (
            <div className="p-6 text-center text-gray-500">
                {t("Yükleniyor...")}
            </div>
        );
    }

    return (
        <>
            {/* 🔹 META TAGLAR */}
            {seoData && (
                <Helmet>
                    <title>{seoData.meta_title}</title>
                    <meta
                        name="description"
                        content={seoData.meta_description}
                    />
                    <meta name="keywords" content={seoData.keywords} />
                    <link rel="canonical" href={seoData.canonical_url} />

                    {/* Open Graph */}
                    <meta property="og:title" content={seoData.meta_title} />
                    <meta
                        property="og:description"
                        content={seoData.meta_description}
                    />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={seoData.canonical_url} />
                    {seoData.image && (
                        <meta property="og:image" content={seoData.image} />
                    )}

                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={seoData.meta_title} />
                    <meta
                        name="twitter:description"
                        content={seoData.meta_description}
                    />
                    {seoData.image && (
                        <meta name="twitter:image" content={seoData.image} />
                    )}
                </Helmet>
            )}

            <Header />

            <main className="blog-detail max-w-6xl mx-auto px-4 py-10">
                <article className="bg-white rounded-2xl shadow-md p-6 md:p-10">
                    {/* 🔹 Başlık */}
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 leading-tight">
                        {blog.title}
                    </h1>

                    {/* 🔹 Görsel */}
                    {blog.image && (
                        <figure className="mb-6">
                            <img
                                src={seoData?.image}
                                alt={blog.title}
                                className="w-full rounded-xl shadow-md object-cover max-h-[480px]"
                                loading="lazy"
                            />
                        </figure>
                    )}

                    {/* 🔹 İçerik */}
                    {blog.content && (
                        <section
                            className="prose max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    )}

                    {/* 🔹 Ek Bölümler */}
                    {Array.isArray(blog.sections) &&
                        blog.sections.length > 0 && (
                            <section className="mt-10">
                                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                                    {t("Ek Bölümler")}
                                </h2>
                                {blog.sections.map((section, i) => (
                                    <div
                                        key={i}
                                        className="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
                                    >
                                        {section.title && (
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {section.title}
                                            </h3>
                                        )}
                                        {section.content && (
                                            <div
                                                className="prose text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: section.content,
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                    {/* 🔹 SSS */}
                    {Array.isArray(blog.faqs) && blog.faqs.length > 0 && (
                        <section className="mt-10 border-t pt-8">
                            <h2 className="text-2xl font-bold mb-4 text-blue-700">
                                {blog.faq_title || t("Sıkça Sorulan Sorular")}
                            </h2>
                            {blog.faqs.map((faq, i) => (
                                <details
                                    key={i}
                                    className="mb-3 bg-gray-50 border border-gray-200 rounded-lg p-4"
                                >
                                    <summary className="font-semibold text-gray-800 cursor-pointer">
                                        {faq.q}
                                    </summary>
                                    <p className="text-gray-600 mt-2">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </section>
                    )}

                    {/* 🔹 Anahtar Kelimeler */}
                    {Array.isArray(blog.keywords) &&
                        blog.keywords.length > 0 && (
                            <aside className="mt-8">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    {t("Anahtar Kelimeler")}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.keywords.map((kw, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                        >
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </aside>
                        )}

                    {/* 🔹 Backlinkler */}
                    {Array.isArray(blog.backlinks) &&
                        blog.backlinks.length > 0 && (
                            <aside className="mt-8">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                    {t("Kaynaklar / Backlinkler")}
                                </h3>
                                <ul className="list-disc list-inside text-blue-600 space-y-1">
                                    {blog.backlinks.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline break-words"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        )}
                </article>
            </main>
        </>
    );
};

export default BlogDetail;
