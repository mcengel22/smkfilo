import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFavorite } from "../../../../ServerSide/Hooks/useFavorite";
import Swal from "sweetalert2"; // Swal eklendi

const UserFavorites = () => {
    const { t } = useTranslation();
    const [favoriler, setFavoriler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const { setFavorite, processFavorite } = useFavorite();

    // 🔃 Favorileri backend'den çek
    const fetchFavorites = async () => {
        try {
            const response = await setFavorite();
            setFavoriler(response?.data?.favorites || []);
        } catch (err) {
            console.error("Favoriler alınamadı ❌", err);
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // 🗑 Kalp tuşuna basınca tetiklenir
    const handleToggleFavorite = async (postId) => {
        const sonuc = await Swal.fire({
            title: t("Emin misiniz?"),
            text: t("Bu ilanı favorilerinizden kaldırmak üzeresiniz."),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t("Evet, kaldır"),
            cancelButtonText: t("İptal"),
        });

        if (sonuc.isConfirmed) {
            try {
                await processFavorite({ post_id: postId });
                await fetchFavorites();

            } catch (error) {

            }
        }
    };

    return (
        <div className="user-favorites">
            {yukleniyor ? (
                <div className="loading-state">
                    <svg className="animate-spin" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#f3f4f6" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" strokeLinecap="round" />
                    </svg>
                    <p>{t('Favorileriniz yükleniyor...')}</p>
                </div>
            ) : favoriler.length > 0 ? (
                <>
                    <div className="favorites-header">
                        <h2>{t('Favori Villalarım')}</h2>
                        <p className="favorite-count">{favoriler.length} villa</p>
                    </div>
                    <div className="favorites-grid">
                        {favoriler.map((item, index) => {
                            const post = item.post;
                            return (
                                <div key={post.id || index} className="villa-card">
                                    <button
                                        className="remove-favorite"
                                        title="Favorilerden Kaldır"
                                        onClick={() => handleToggleFavorite(post.id)}
                                    >
                                        <i className="icon heart-fill"></i>
                                    </button>
                                    <Link to={`/detay/${post.slug}`}>
                                        <div className="villa-image">
                                            <img src={post.cover?.media_url || "/default.jpg"} alt={post.title} />
                                        </div>
                                        <div className="villa-info">
                                            <h3>{post.title}</h3>
                                            <p className="location">{post.region || post.city}</p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <svg viewBox="0 0 24 24" width="64" height="64">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <h3>{t('Henüz Favori Villanız Yok')}</h3>
                        <p>{t('Beğendiğiniz villaları favorilerinize ekleyerek daha sonra kolayca ulaşabilirsiniz.')}</p>
                        <Link to="/home" className="discover-btn">
                            {t('İlanları Keşfet')}
                            <svg className="arrow-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFavorites;
