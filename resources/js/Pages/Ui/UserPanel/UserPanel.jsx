import React, { useState } from "react";
import Header from "../../../Components/UI/Header/Header";
import UserReservation from "./Misc/UserReservation";
import UserReviews from "./Misc/UserReviews";
import UserSetting from "./Misc/UserSetting";
import CouponPage from "./Misc/CouponPage";
import UserFavorites from "./Misc/UserFavorite";
import { useTranslation } from "react-i18next";
import MyAdvert from "./Misc/Setting/MyAdvert";
import Aside from "./Aside";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../Libs/Routes/config";
import { useSelector } from "react-redux";

const UserPanel = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("reservations");
    const user = useSelector((state) => state.auth.user);

    console.log("burda");
    // Kullanıcı tipine göre yetki kontrolü
    const hasPermission = (requiredType) => {
        if (!user) return false;

        switch (requiredType) {
            case "super_admin":
                return user.type === "super_admin";
            case "admin_or_higher":
                return ["admin", "super_admin"].includes(user.type);
            case "any_user":
                return ["user", "admin", "super_admin"].includes(user.type);
            default:
                return false;
        }
    };

    return (
        <div className="inner-page panel superadmin">
            <Header />

            <div className="max-w-9xl mx-auto sm:px-2 md:px-2 flex flex-col my-6 px-3">
                <div className="flex flex-wrap">
                    {/* Sadece super_admin için Aside göster */}
                    {hasPermission("super_admin") && (
                        <div className="w-full lg:w-1/4 px-3">
                            <Aside />
                        </div>
                    )}
                    <div
                        className={`w-full ${hasPermission("super_admin") ? "lg:w-3/4" : "lg:w-full"} px-3`}
                    >
                        <h1 className="text-xl font-bold mb-4">
                            {t("Hoş Geldiniz!")}
                        </h1>
                        <div className="navigation-tab">
                            <div className="tabs-menu">
                                <ul
                                    className="nav nav-tabs flex"
                                    role="tablist"
                                >
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className={`nav-link py-2 px-4 ${activeTab === "dashboard" ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveTab("dashboard")
                                            }
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                activeTab === "dashboard"
                                            }
                                        >
                                            <span>{t("Pano")}</span>
                                        </button>
                                    </li>

                                    {/* İlanlarım sadece admin ve super_admin için görünür */}
                                    {hasPermission("admin_or_higher") && (
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className={`nav-link py-2 px-4 ${activeTab === "advert" ? "active" : ""}`}
                                                onClick={() =>
                                                    setActiveTab("advert")
                                                }
                                                type="button"
                                                role="tab"
                                                aria-selected={
                                                    activeTab === "advert"
                                                }
                                            >
                                                <span>{t("İlanlarım")}</span>
                                            </button>
                                        </li>
                                    )}

                                    {/* Diğer menü öğeleri herkes için görünür */}
                                    {/* <li className="nav-item" role="presentation">
                                        <button
                                            className={`nav-link py-2 px-4 ${activeTab === "reservations" ? "active" : ""}`}
                                            onClick={() => setActiveTab("reservations")}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === "reservations"}
                                        >
                                            <span>{t('Rezervasyonlarım')}</span>
                                        </button>
                                    </li> */}
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className={`nav-link py-2 px-4 ${activeTab === "reviews" ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveTab("reviews")
                                            }
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                activeTab === "reviews"
                                            }
                                        >
                                            <span>{t("Yorumlarım")}</span>
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className={`nav-link py-2 px-4 ${activeTab === "settings" ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveTab("settings")
                                            }
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                activeTab === "settings"
                                            }
                                        >
                                            <span>{t("Ayarlar")}</span>
                                        </button>
                                    </li>
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveTab("favorites")
                                            }
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                activeTab === "favorites"
                                            }
                                        >
                                            <span>{t("Favorilerim")}</span>
                                        </button>
                                    </li>
                                    {/*<li className="nav-item" role="presentation">*/}
                                    {/*    <Link*/}
                                    {/*        href=""*/}
                                    {/*        className={`nav-link ${activeTab === "coupon" ? "active" : ""}`}*/}
                                    {/*        onClick={() => setActiveTab("coupon")}*/}
                                    {/*        type="button"*/}
                                    {/*        role="tab"*/}
                                    {/*        aria-selected={activeTab === "coupon"}*/}
                                    {/*    >*/}
                                    {/*        <span>{t('Kupon Kodu')}</span>*/}
                                    {/*    </Link>*/}
                                    {/*</li>*/}
                                </ul>
                            </div>

                            <div className="tab-content mt-4">
                                {/* İçerik bölümü de yetkilendirme bazlı kontrol */}
                                {activeTab === "advert" &&
                                    hasPermission("admin_or_higher") && (
                                        <MyAdvert />
                                    )}
                                {activeTab === "reservations" && (
                                    <UserReservation />
                                )}
                                {activeTab === "reviews" && <UserReviews />}
                                {activeTab === "settings" && <UserSetting />}
                                {activeTab === "favorites" && <UserFavorites />}
                                {/*{activeTab === "coupon" && <CouponPage />}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPanel;
