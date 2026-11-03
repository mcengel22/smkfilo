import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useKmPaketleri } from "../../../../ServerSide/Hooks/useKmPaketleri";
import "./ReservationModal.css";



const ReservationModal = ({ item, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const { fetchKmPackages } = useKmPaketleri();
    const kmPackages = useSelector((state) => state.kmPaketleri.kmPackages);
    const [selectedAddon, setSelectedAddon] = useState(null);

    useEffect(() => {
        fetchKmPackages();
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const toggleAddon = (id) => {
        setSelectedAddon((prev) => (prev === id ? null : id));
    };

    const selectedPackage = kmPackages.find((o) => o.id === selectedAddon);
    const addonTotal = selectedPackage ? Number(selectedPackage.price) : 0;

    const totalPrice = Number(item.price) + addonTotal;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm({ item, selectedAddon, totalPrice });
        }
    };

    return (
        <div
            className="res-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="res-modal">
                {/* Başlık */}
                <div className="res-modal-head">
                    <div>
                        <h2>{item.years} Yıllık Kullanım Paketi</h2>
                        <p>
                            Paket detaylarını inceleyip rezervasyonunuzu
                            tamamlayın
                        </p>
                    </div>
                    <button className="res-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="res-modal-body">
                    {/* Paket özeti */}
                    <div className="res-pkg-summary">
                        <div className="res-pkg-stat">
                            <span>Süre</span>
                            <span>{item.years} Yıl</span>
                        </div>
                        <div className="res-pkg-stat">
                            <span>KM Limiti</span>
                            <span>
                                {Number(item.km).toLocaleString("tr-TR")} KM
                            </span>
                        </div>
                        <div className="res-pkg-stat">
                            <span>Paket Fiyatı</span>
                            <span>
                                {Number(item.price).toLocaleString("tr-TR")} ₺
                            </span>
                        </div>
                    </div>

                    {/* Ek KM seçenekleri */}
                    <p className="res-addon-label">{t("Ek Paketler")}</p>
                    {kmPackages.map((opt) => (
                        <div
                            key={opt.id}
                            className={`res-addon-card ${selectedAddon === opt.id ? "selected" : ""}`}
                            onClick={() => toggleAddon(opt.id)}
                        >
                            <div className="res-addon-left">
                                <div className="res-addon-checkbox">
                                    <svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                    >
                                        <path
                                            d="M1 5L4.5 8.5L11 1.5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="res-addon-info">
                                    <strong>{Number(opt.km).toLocaleString("tr-TR")} KM {t("Ek Paket")}</strong>
                                    <small>
                                        +
                                        {Number(opt.km).toLocaleString("tr-TR")}{" "}
                                        KM limit eklenir
                                    </small>
                                </div>
                            </div>
                            <span className="res-addon-price">
                                +{Number(opt.price).toLocaleString("tr-TR")} ₺
                            </span>
                        </div>
                    ))}

                    {/* Toplam */}
                    <div className="res-total-row">
                        <span>Toplam Tutar</span>
                        <span>{totalPrice.toLocaleString("tr-TR")} ₺</span>
                    </div>

                    {/* Onayla */}
                    <button className="res-confirm-btn" onClick={handleConfirm}>
                        Rezervasyonu Onayla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
