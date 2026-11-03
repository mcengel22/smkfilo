import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TYPE } from "../../../../Libs/Global/postTypes";
import { ROUTES } from "../../../../Libs/Routes/config";
import { useFavorite } from "../../../../ServerSide/Hooks/useFavorite";
import Swal from "sweetalert2";

const ListCard = ({ data }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [isFavorite, setIsFavorite] = useState(data.favorite ?? false);
    const { processFavorite } = useFavorite();

    const features =
        Array.isArray(data.cards) && data.cards.length > 0
            ? data.cards
            : Array.isArray(data.details) && data.details.length > 0
              ? data.details
              : Array.isArray(data.attributes)
                ? data.attributes
                      .filter((attr) => attr.attr_type === "operation")
                      .map((attr) => ({
                          key: `operation_${attr.id}`,
                          title: attr.title,
                          icon: attr?.info?.icon_class || "settings",
                          value: attr.desc || attr.title,
                      }))
                : [];

    // --- RESİM HATA YÖNETİMİ FONKSİYONU ---
    const handleImageError = (e, originalPath) => {
        const target = e.currentTarget;

        // Eğer resim zaten 'no-image.jpg' ise döngüye girmesin
        if (target.src.includes("no-image.jpg")) return;

        // Şu anki denenen kaynak 'benimtatilcim.com' içeriyor mu?
        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && originalPath) {
            // SENARYO 1: Kendi sunucunda/localde bulamadı -> benimtatilcim.com'a bak
            const cleanPath = originalPath.startsWith("/")
                ? originalPath.substring(1)
                : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            // SENARYO 2: Orada da yoksa -> No Image göster
            target.src = "/img/no-image.jpg";
        }
    };
    // ---------------------------------------

    // 🫀 Kalp butonu tıklama
    const handleToggleFavorite = async () => {
        if (!user) {
            const sonuc = await Swal.fire({
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
        <div className="list-view">
            <div className="card">
                <div className="wrapper">
                    <div className="img-wrapper">
                        <Link
                            to={`${ROUTES.UI.DETAIL}/${data.slug}`}
                            className="property-img"
                        >
                            {/* --- GÜNCELLENEN RESİM ALANI --- */}
                            <img
                                src={
                                    data?.cover?.media_url
                                        ? data.cover.media_url.startsWith(
                                              "http",
                                          )
                                            ? data.cover.media_url
                                            : data.cover.media_url // İlk deneme: Olduğu gibi
                                        : "/img/no-image.jpg"
                                }
                                className="img-fluid"
                                width={350}
                                height={250}
                                alt="Property"
                                loading="lazy"
                                onError={(e) =>
                                    handleImageError(e, data?.cover?.media_url)
                                }
                            />
                            {/* ------------------------------- */}
                        </Link>

                        <div className="favorite-action">
                            <button
                                className="favorite"
                                onClick={handleToggleFavorite}
                            >
                                <i
                                    className={`icon ${isFavorite ? "heart-fill" : "heart"}`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    <div className="badge-wrapper">
                        <div className="badge">
                            <i className="icon night"></i>
                            {t("En az")} {data.min_days} {"gün"}
                        </div>
                        {/* <div className="badge">{t("İlan No:")} {data.code}</div> */}
                    </div>
                </div>

                <div className="detail">
                    <div className="rating">
                        <span className="rating-count">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    className={`icon star ${i < data.rating ? "checked" : ""}`}
                                    key={i}
                                ></i>
                            ))}
                        </span>
                        <p className="rating-review">
                            {data.comments_count !== 0 ? (
                                <>
                                    <span className="me-1">5</span>{" "}
                                    {data.comments_count}
                                </>
                            ) : (
                                t("Yorum Yapılmamış")
                            )}
                        </p>
                    </div>

                    <div className="mb-2">
                        <div className="name">
                            <Link to="#">{data.title}</Link>
                        </div>
                        {/* <div className="location">
                            <i className="icon map"></i>
                            {data.district && `${data.district} /`} {data.city}
                        </div> */}
                        <div className="location">
                            <i className="icon map"></i>
                            İstanbul / Esenyurt
                        </div>
                    </div>

                    {features.length > 0 && (
                        <div className="type-detail">
                            <ul className="list-unstyled">
                                {features.map((feature, i) => (
                                    <li key={feature.key ?? i}>
                                        <i
                                            className={`icon ${feature.icon || "settings"}`}
                                        ></i>
                                        <span className="fs-8 t-fw-500">
                                            {feature.value || feature.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="price">
                        <span className="priceTitle">
                            {data.min_price !== null
                                ? `₺ ${parseFloat(
                                      data.min_price,
                                  ).toLocaleString("tr-TR", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })} `
                                : "₺0,00 "}
                            {t("başlayan fiyatlarla  /")}
                            <span className="text-gray-500">
                                {t("Gecelik")}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
