import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../Libs/Routes/config";
import { useSelector } from "react-redux";
import { useFavorite } from "../../../ServerSide/Hooks/useFavorite";
import { loadSwal } from "@/Libs/Global/swal.js";

// 48500 -> "48.500 ₺"
const formatPrice = (value) =>
    `${Number(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺`;

const AdvertCard = ({ data }) => {
    // Hook'lar her render'da aynı sırada çağrılmalı; erken return'den önce gelmeli
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { processFavorite } = useFavorite();
    const [isFavorite, setIsFavorite] = useState(data?.favorite ?? false);

    if (!data) return null;

    const handleImageError = (e) => {
        const target = e.currentTarget;
        if (!target.src.includes("no-image.jpg")) {
            target.src = "/img/no-image.jpg";
        }
    };

    const handleToggleFavorite = async () => {
        if (!user) {
            const sonuc = await (await loadSwal()).fire({
                title: t("Favorilere eklemek ister misiniz?"),
                text: t(
                    "Bu özelliği kullanabilmek için önce giriş yapmanız gerekiyor.",
                ),
                icon: "info",
                showCancelButton: true,
                confirmButtonText: t("Giriş Yap"),
                cancelButtonText: t("Vazgeç"),
            });

            if (sonuc.isConfirmed) {
                navigate(ROUTES.AUTH.LOGIN);
            }

            return;
        }

        try {
            await processFavorite({ post_id: data.id });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Favori toggle hatası", error);
        }
    };

    return (
        <div className="card">
            <div className="wrapper">
                <div className="img-wrapper">
                    <Link
                        to={`${ROUTES.UI.DETAIL}/${data.slug}`}
                        className="property-img"
                    >
                        <img
                            src={data.cover?.media_url || "/img/no-image.jpg"}
                            alt={data.cover?.media_alt || data.title}
                            title={data.cover?.media_title || data.title}
                            className="img-fluid"
                            width={350}
                            height={250}
                            loading="lazy"
                            onError={handleImageError}
                        />
                    </Link>
                </div>

                <div className="badge-wrapper">
                    <div className="badge">
                        <i className="icon night"></i>
                        En az {data.min_days || "1"} gün
                    </div>
                </div>

                <div className="favorite-action">
                    <button className="favorite" onClick={handleToggleFavorite}>
                        <i
                            className={`icon ${isFavorite ? "heart-fill" : "heart"}`}
                        ></i>
                    </button>
                </div>
            </div>

            <div className="detail">
                {/* Hiç yorum yoksa boş yıldız/0 Yorum göstermiyoruz */}
                {data.comments_count > 0 && (
                    <div className="rating">
                        <span className="rating-count">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    className={`icon star ${i < Math.round(data.rating) ? "checked" : ""}`}
                                    key={i}
                                ></i>
                            ))}
                        </span>
                        <p className="rating-review">
                            <span className="me-1">{Math.round(data.rating)}</span>{" "}
                            ({data.comments_count} Yorum)
                        </p>
                    </div>
                )}

                <div className="mb-2">
                    <div className="name" title={data.title}>
                        <Link to={`${ROUTES.UI.DETAIL}/${data.slug}`}>
                            {data.title}
                        </Link>
                    </div>
                    {(data.city || data.district) && (
                        <div className="location">
                            <i className="icon map"></i>
                            {[data.city, data.district].filter(Boolean).join(" / ")}
                        </div>
                    )}
                </div>

                <div className="price">
                    <span className="priceTitle">
                        {formatPrice(data.min_price)}
                        <span className="text-gray-500">
                            {t("Başlayan fiyatlarla")}
                        </span>
                    </span>
                </div>
            </div>

            <div className="links">
                <Link
                    to={`${ROUTES.UI.DETAIL}/${data.slug}`}
                    className="btn btn-orange"
                >
                    {t("Hemen İncele")}
                </Link>
            </div>
        </div>
    );
};

export default AdvertCard;
