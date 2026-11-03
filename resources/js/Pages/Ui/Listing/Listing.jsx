import React, { useEffect, useState } from "react";
import Header from "../../../Components/UI/Header/Header";
import Sidebar from "../../../Components/UI/Misc/Sidebar/Sidebar";
import Breadcrumb from "../../../Components/UI/Misc/Breadcrumb";
import ListCard from "./Misc/ListCard";
import PaginationNavigator from "../../../Components/UI/Misc/PaginationNavigator";
import HomeFilter from "../Home/Misc/HomeFilter";
import { useSelector, useDispatch } from "react-redux";
import { usePost } from "../../../ServerSide/Hooks/usePost";
import ListingLoad from "./Load";
import Select from "react-dropdown-select";
import { useTranslation } from "react-i18next";
import SkeletonListing from "./SkeletonListing";
import { updateFilters } from "../../../Repo/Redux/Modules/FilterSlice";
import { useSeo } from "../../../ServerSide/Hooks/useSeo";
import { Helmet } from "react-helmet-async";

const Listing = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const postsIsLoading = useSelector((state) => state.post.loading);
    const posts = useSelector((state) => state.post.posts);
    const pagination = useSelector((state) => state.post?.pagination || null);
    const { filters } = useSelector((state) => state.filter);
    const region = useSelector((state) => state.filter.region);
    const { per_page, total } = pagination ?? {};

    const { setPostsByFilter } = usePost();
    const { getSeoByType } = useSeo();

    const [seoData, setSeoData] = useState(null);
    const [selectedSort, setSelectedSort] = useState([
        {
            value: "akilli-siralama",
            by: "id",
            direction: "desc",
            label: "Akıllı Sıralama",
        },
    ]);

    const SORT_OPTIONS = [
        {
            value: "akilli-siralama",
            by: "id",
            direction: "desc",
            label: "Akıllı Sıralama",
        },
        {
            value: "tarih-yeni",
            by: "created_at",
            direction: "desc",
            label: "Tarihe Göre (En Yeni)",
        },
        {
            value: "tarih-eski",
            by: "created_at",
            direction: "asc",
            label: "Tarihe Göre (En Eski)",
        },
        {
            value: "fiyat-artan",
            by: "price",
            direction: "asc",
            label: "Fiyata Göre (En Düşükten)",
        },
        {
            value: "fiyat-azalan",
            by: "price",
            direction: "desc",
            label: "Fiyata Göre (En Yüksekten)",
        },
    ];

    // 🧠 {bolge} değişkenini bölge ismine çevir
    const replaceBolge = (text) => {
        if (!text) return "";
        const regionName = region?.name || filters?.region?.name || "Türkiye";
        return text
            .replaceAll("{bolge}", regionName)
            .replaceAll("{BOLGE}", regionName.toUpperCase());
    };

    // 🔹 İlanları getir
    const getPosts = async () => {
        try {
            await setPostsByFilter(filters);
        } catch (error) {
            console.error("Postlar çekilirken hata:", error);
        }
    };

    // 🔹 SEO verisini getir
    const getSeoData = async () => {
        try {
            const res = await getSeoByType(filters?.type);
            if (res && Object.keys(res).length > 0) {
                setSeoData(res);
            } else {
                setSeoData(null);
            }
        } catch (error) {
            console.error("SEO datası çekilemedi:", error);
            setSeoData(null);
        }
    };

    // 🔁 Değişikliklerde yeniden getir
    useEffect(() => {
        window.scrollTo(0, 0);
        getPosts();
        getSeoData();
    }, [filters?.pagination, filters?.sort, filters?.type]);

    // 🔁 SEO datası değişince meta fallback
    useEffect(() => {
        if (seoData?.meta_title) {
            document.title = replaceBolge(seoData.meta_title);

            const descContent = replaceBolge(seoData.meta_description || "");
            const keywordsContent = replaceBolge(seoData.keywords || "");
            const canonicalUrl = seoData.canonical_url || window.location.href;

            // description
            let desc = document.querySelector("meta[name='description']");
            if (!desc) {
                desc = document.createElement("meta");
                desc.name = "description";
                document.head.appendChild(desc);
            }
            desc.content = descContent;

            // keywords
            let keys = document.querySelector("meta[name='keywords']");
            if (!keys) {
                keys = document.createElement("meta");
                keys.name = "keywords";
                document.head.appendChild(keys);
            }
            keys.content = keywordsContent;

            // canonical
            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                canonical = document.createElement("link");
                canonical.rel = "canonical";
                document.head.appendChild(canonical);
            }
            canonical.href = canonicalUrl;

            // OG tags
            const ogTags = [
                {
                    property: "og:title",
                    content: replaceBolge(seoData.meta_title),
                },
                {
                    property: "og:description",
                    content: replaceBolge(seoData.meta_description),
                },
                { property: "og:url", content: canonicalUrl },
                { property: "og:image", content: seoData.image },
                { property: "og:type", content: "website" },
            ];

            ogTags.forEach((og) => {
                if (!og.content) return;
                let tag = document.querySelector(
                    `meta[property='${og.property}']`,
                );
                if (!tag) {
                    tag = document.createElement("meta");
                    tag.setAttribute("property", og.property);
                    document.head.appendChild(tag);
                }
                tag.content = og.content;
            });
        }
    }, [seoData]);

    // 🔹 Sıralama değiştir
    const handleSortChange = (values) => {
        if (values.length > 0) {
            const selected = values[0];
            setSelectedSort(values);
            dispatch(
                updateFilters({
                    sort: {
                        by: selected.by,
                        direction: selected.direction,
                    },
                }),
            );
        }
    };

    return (
        <div className="inner-page">
            <ListingLoad />
            <div className="inner-page detail-page">
                {/* 🧠 META HEAD (Dinamik SEO) */}
                {seoData && (
                    <Helmet
                        key={
                            seoData?.id || seoData?.meta_title || "seo-dynamic"
                        }
                    >
                        <title>
                            {replaceBolge(
                                seoData.meta_title ||
                                    seoData.main_title ||
                                    "Renta Car - Araç Kiralama",
                            )}
                        </title>

                        <meta
                            name="description"
                            content={replaceBolge(
                                seoData.meta_description ||
                                    seoData.main_description ||
                                    "",
                            )}
                        />

                        {seoData.keywords && (
                            <meta
                                name="keywords"
                                content={replaceBolge(seoData.keywords)}
                            />
                        )}

                        <link
                            rel="canonical"
                            href={seoData.canonical_url || window.location.href}
                        />

                        {/* 🔹 Open Graph Meta */}
                        <meta
                            property="og:title"
                            content={replaceBolge(seoData.meta_title)}
                        />
                        <meta
                            property="og:description"
                            content={replaceBolge(seoData.meta_description)}
                        />
                        <meta
                            property="og:url"
                            content={
                                seoData.canonical_url || window.location.href
                            }
                        />
                        {seoData.image && (
                            <meta property="og:image" content={seoData.image} />
                        )}
                        <meta property="og:type" content="website" />
                    </Helmet>
                )}

                {/* 🔹 SAYFA İÇERİĞİ */}
                <Header />
                {/* <div className="mt-5">
                    <HomeFilter />
                </div> */}

                <div className="max-w-8xl mx-auto sm:px-2 md:px-2">
                    <Breadcrumb />

                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-1/3 px-3">
                            <Sidebar />
                        </div>

                        <div className="w-full lg:w-2/3 px-3">
                            <div className="ads-list">
                                {/* <div className="filter mb-5 flex justify-end">
                                    <div className="w-full max-w-xs ml-auto">
                                        <Select
                                            options={SORT_OPTIONS}
                                            values={selectedSort}
                                            onChange={handleSortChange}
                                            labelField="label"
                                            valueField="value"
                                            dropdownHandle
                                            clearable={false}
                                            style={{
                                                borderRadius: "8px",
                                                border: "1px solid #ccc",
                                                padding: "6px 12px",
                                                fontSize: "14px",
                                                backgroundColor: "#fff",
                                            }}
                                        />
                                    </div>
                                </div> */}

                                {postsIsLoading ? (
                                    <SkeletonListing />
                                ) : (
                                    <div className="ilan-list">
                                        {posts?.map((post, index) => (
                                            <ListCard key={index} data={post} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="page-info mb-3 flex justify-end">
                                <p className="text-right text-sm text-gray-500">
                                    Toplam <strong>{total}</strong> ilan bulundu
                                    — sayfada <strong>{per_page}</strong> ilan
                                    listeleniyor.
                                </p>
                            </div>

                            {!postsIsLoading && (
                                <div className="mt-4">
                                    <PaginationNavigator
                                        pagination={pagination}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 🔹 SEO CONTENT */}
                    {seoData && seoData?.main_title && (
                        <section
                            className="seo-section mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            aria-label={replaceBolge(seoData.main_title)}
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
                                {seoData?.image && (
                                    <figure className="w-full md:w-1/2 flex justify-center">
                                        <img
                                            src={seoData.image}
                                            alt={replaceBolge(
                                                seoData.main_title,
                                            )}
                                            className="w-full max-w-md h-auto rounded-lg object-cover shadow-md"
                                            loading="lazy"
                                        />
                                    </figure>
                                )}

                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <h1
                                        className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                                        dangerouslySetInnerHTML={{
                                            __html: replaceBolge(
                                                seoData?.main_title || "",
                                            ),
                                        }}
                                    ></h1>

                                    {seoData?.main_description && (
                                        <div
                                            className="text-gray-700 text-base leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: replaceBolge(
                                                    seoData.main_description,
                                                ),
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>

                            {(seoData?.titles?.length > 0 ||
                                seoData?.descriptions?.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border-t border-gray-100">
                                    {seoData?.titles?.map((title, i) => (
                                        <article
                                            key={i}
                                            className="seo-sub-item"
                                        >
                                            <h2
                                                className="text-lg md:text-xl font-semibold text-gray-800 mb-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: replaceBolge(title),
                                                }}
                                            ></h2>
                                            <div
                                                className="text-gray-700 text-sm md:text-base leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: replaceBolge(
                                                        seoData?.descriptions?.[
                                                            i
                                                        ] || "",
                                                    ),
                                                }}
                                            ></div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {seoData?.keywords && (
                                <div className="p-6 md:p-8 border-t border-gray-100">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3">
                                        <strong>
                                            {t("İlgili Anahtar Kelimeler")}
                                        </strong>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {seoData.keywords
                                            .split(",")
                                            .filter((kw) => kw.trim() !== "")
                                            .map((kw, i) => (
                                                <span
                                                    key={i}
                                                    className="text-sm font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-200 transition"
                                                    dangerouslySetInnerHTML={{
                                                        __html: replaceBolge(
                                                            kw.trim(),
                                                        ),
                                                    }}
                                                ></span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Listing;
