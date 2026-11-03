import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ProfilForm from "./Setting/ProfileForm";
import PasswordForm from "./Setting/PasswordForm";
import NotificationForm from "./Setting/NotificationForm";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../../../ServerSide/Hooks/useUser";

const UserSetting = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user);
    const [aktifTab, setAktifTab] = useState("profil");
    const { requestAdmin } = useUser(); // hook'tan çekiyoruz

    // Kopyalama işlemi
    const copyRefCode = () => {
        if (user?.ref_code) {
            navigator.clipboard.writeText(user.ref_code);
            toast.success("Referans kodu kopyalandı! ✅");
        } else {
            toast.error("Referans kodu bulunamadı ❌");
        }
    };

    // Admin olma isteği
    const ownerClick = async () => {
        try {
            const result = await Swal.fire({
                title: "Ev sahibi Olma Talebi",
                text: "",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Evet, Gönder",
                cancelButtonText: "İptal"
            });

            if (result.isConfirmed) {
                await requestAdmin();
                Swal.fire({
                    title: "Talebiniz Alındı ✅",
                    text: "Yöneticiler tarafından onaylandığında bilgilendirileceksiniz.",
                    icon: "success"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Hata ❌",
                text: "İstek gönderilemedi. Lütfen tekrar deneyin.",
                icon: "error"
            });
        }
    };

    return (
        <div>
            <ToastContainer />

            {user?.type === 'user' && user?.admin_request_status !== 'bekliyor' && (
                <div className="bg-white p-4 mb-3 rounded-xl flex justify-between items-center">
                    <div>
                        <span className="font-bold block">{t('Kendi Yerini Kiraya Vermek İster misin?')}</span>
                        <p className="text-sm font-medium">
                            {t('Otel, villa, bungalov veya diğer konaklama yerlerinizi kiraya vermek için ilanınızı oluşturun ve misafirlerinizi beklemeye başlayın!')}
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={ownerClick}>
                        {t('Ev Sahibi Ol')}
                    </button>
                </div>
            )}

            <div className="ayarlar-container">
                <div className="ayarlar-tabs">
                    <div className="tabs-item">
                        <button className={`tab-btn ${aktifTab === "profil" ? "aktif" : ""}`} onClick={() => setAktifTab("profil")}>
                            {t('Profil Bilgileri')}
                        </button>
                        <button className={`tab-btn ${aktifTab === "bildirim" ? "aktif" : ""}`} onClick={() => setAktifTab("bildirim")}>
                            {t('Bildirim Ayarları')}
                        </button>
                        <button className={`tab-btn ${aktifTab === "sifre" ? "aktif" : ""}`} onClick={() => setAktifTab("sifre")}>
                            {t('Şifre Değiştir')}
                        </button>
                    </div>

                    {/*<div className="referans-kodu-card mt-1">*/}
                    {/*    <div className="referans-kodu-wrapper">*/}
                    {/*        <label htmlFor="refCode" className="referans-label">*/}
                    {/*            {t('Referans Kodu:')}*/}
                    {/*        </label>*/}
                    {/*        <div className="referans-input-container">*/}
                    {/*            <input*/}
                    {/*                id="refCode"*/}
                    {/*                type="text"*/}
                    {/*                value={user?.ref_code || ""}*/}
                    {/*                readOnly*/}
                    {/*                className="referans-input"*/}
                    {/*            />*/}
                    {/*            <button onClick={copyRefCode} className="copy-btn">*/}
                    {/*                📋 {t('Kopyala')}*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <div className="tab-icerik mt-4">
                    {aktifTab === "profil" && (
                        <div className="tab-panel">
                            <ProfilForm />
                        </div>
                    )}

                    {aktifTab === "bildirim" && (
                        <div className="tab-panel">
                            <NotificationForm />
                        </div>
                    )}

                    {aktifTab === "sifre" && (
                        <div className="tab-panel">
                            <PasswordForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSetting;
