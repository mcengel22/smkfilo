import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeo } from "@/ServerSide/Hooks/useSeo";

const DynamicSeo = () => {
    const location = useLocation();
    const { getSeoByType } = useSeo(true); // ✅ frontend safe
    const [seoData, setSeoData] = useState(window.__INITIAL_SEO__ || null);

    // 🔹 URL değiştikçe SEO datasını güncelle
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get("type");

        (async () => {
            if (type) {
                const res = await getSeoByType(type);
                if (res && Object.keys(res).length > 0) setSeoData(res);
            }
        })();
    }, [location.search, location.pathname]);

    if (!seoData) return null;

    const title = seoData.meta_title || seoData.main_title || "Araç Kiralama";
    const desc =
        seoData.meta_description ||
        seoData.main_description ||
        "Türkiye’nin dört bir yanında araçlar seni bekliyor.";
    const canonical = seoData.canonical_url || window.location.href;
    const image = seoData.image || seoData.media?.url || "/img/smkfavicon.png";

    return (
        <Helmet key={location.pathname + location.search}>
            <title>{title}</title>
            <meta name="description" content={desc} />
            {seoData.keywords && (
                <meta name="keywords" content={seoData.keywords} />
            )}
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default DynamicSeo;
