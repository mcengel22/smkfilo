import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useComment } from "@/ServerSide/Hooks/useComment.jsx";

const UserReviews = () => {
    const { t } = useTranslation();
    const { setMyComment } = useComment();

    const [yorumlar, setYorumlar] = useState([]);
    const [filtrelemeDurumu, setFiltrelemeDurumu] = useState("Tümü");
    const [filtrelenmisYorumlar, setFiltrelenmisYorumlar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const hasFetchedRef = useRef(false); // ⛔ Tek fetch için kontrol

    // ✅ İlk yüklemede yorumları çek
    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        const fetchComments = async () => {
            try {
                const result = await setMyComment();

                if (Array.isArray(result?.data)) {
                    setYorumlar(result.data);
                } else {
                    setYorumlar([]);
                }
            } catch {
                setYorumlar([]);
            } finally {
                setYukleniyor(false);
            }
        };

        fetchComments();
    }, []);

    // 🧠 Filtre değiştiğinde yorumları filtrele
    useEffect(() => {
        if (filtrelemeDurumu === "Tümü") {
            setFiltrelenmisYorumlar(yorumlar);
        } else {
            setFiltrelenmisYorumlar(
                yorumlar.filter((yorum) => yorum.status === filtrelemeDurumu)
            );
        }
    }, [filtrelemeDurumu, yorumlar]);

    // 📅 Tarih formatı
    const tarihiFormatla = (tarih) => {
        if (!tarih) return t("Tarih Yok");
        const isoTarih = tarih.replace(" ", "T");
        const date = new Date(isoTarih);
        if (isNaN(date.getTime())) return t("Geçersiz Tarih");
        return date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div className="musteri-yorumlar">
            <div className="yorumlar-header">
                <div className="sol-kisim">
                    <h2>{t("Yorumlar")}</h2>
                    <div className="istatistikler">
                        <div className="istatistik-item">
                            <span className="sayi">
                                {yorumlar.filter((y) => y.status === "approved").length}
                            </span>
                            <span className="etiket">{t("Onaylı Yorum")}</span>
                        </div>
                        <div className="istatistik-item">
                            <span className="sayi">
                                {yorumlar.filter((y) => y.status === "pending").length}
                            </span>
                            <span className="etiket">{t("Onay Bekleyen")}</span>
                        </div>
                        <div className="istatistik-item">
                            <span className="sayi">
                                {yorumlar.filter((y) => y.status === "rejected").length}
                            </span>
                            <span className="etiket">{t("Reddedilen")}</span>
                        </div>
                    </div>
                </div>

                <div className="sag-kisim">
                    <div className="arama-filtre">
                        <select
                            value={filtrelemeDurumu}
                            onChange={(e) => setFiltrelemeDurumu(e.target.value)}
                            className="durum-filtresi"
                        >
                            <option value="Tümü">{t("Tüm Yorumlar")}</option>
                            <option value="approved">{t("Onaylandı")}</option>
                            <option value="pending">{t("Onay Bekliyor")}</option>
                            <option value="rejected">{t("Reddedildi")}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 🔄 Yükleniyor */}
            {yukleniyor ? (
                <div className="yukleniyor">
                    <svg className="animate-spin" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#f3f4f6" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" strokeLinecap="round" />
                    </svg>
                    {t("Yorumlar yükleniyor...")}
                </div>
            ) : (
                <div className="yorumlar-listesi">
                    {filtrelenmisYorumlar?.length > 0 ? (
                        filtrelenmisYorumlar.map((yorum) => (
                            <div key={yorum.id} className="yorum-karti">
                                <div className="yorum-baslik">
                                    <div className="yorum-meta">
                                        <div className="puan">
                                            <i className="icon star"></i>
                                            {yorum.rating || 0}
                                        </div>
                                        <span className="tarih">
                                            {tarihiFormatla(yorum?.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <p className="yorum-metni">{yorum.comment}</p>
                                <div className="yorum-alt">
                                    <span className={`durum-badge ${yorum.status}`}>
                                        {yorum.status === "approved"
                                            ? t("Onaylandı")
                                            : yorum.status === "rejected"
                                                ? t("Reddedildi")
                                                : t("Onay Bekliyor")}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bos-durum">
                            <div className="bos-durum-icerik">
                                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                                <h3>{t("Şu anda yorumunuz bulunmamaktadır")}</h3>
                                <p>{t("Henüz bir yorum eklemediniz ya da yorumlarınız onaylanmayı bekliyor.")}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserReviews;
