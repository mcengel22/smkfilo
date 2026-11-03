import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";

const Aside = () => {
    const { t } = useTranslation();
    const [openMenu, setOpenMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="aside-area">
            <button
                className="hamburger-btn toggle-btn mb-4"
                onClick={toggleSidebar}
            >
                <i className="icon hamburger-bar"></i>
            </button>
            <div className={`aside-menu ${sidebarOpen ? "" : "open"}`}>
                <button className="close-btn" onClick={toggleSidebar}>
                    <i className="icon xmark"></i>
                </button>
                <nav className="menu">
                    <ul>
                        <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.ADVERT}>
                                {t("" + "İlanlar")}
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link
                                className="menu-link"
                                to={ROUTES.UI.KM_PACKAGES}
                            >
                                {t("Km paketleri")}
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.CUSTOMER}>
                                {t("" + "Müşteriler")}
                            </Link>
                        </li>
                        {/* <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.DEALERS}>
                                {t('Bayiler')}
                            </Link>
                        </li> */}

                        <li className="menu-item accordion-menu">
                            <span
                                className="menu-link cursor-pointer"
                                onClick={() => toggleMenu("rezervasyon")}
                            >
                                {t("Rezervasyon")}
                                <i
                                    className={`icon chevron-${openMenu === "rezervasyon" ? "up" : "down"}`}
                                ></i>
                            </span>
                            {openMenu === "rezervasyon" && (
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.RESERVATIONLIST}
                                        >
                                            {t("Rezervasyon Listesi")}
                                        </Link>
                                    </li>
                                    <li className="menu-item">
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.RESERVATIONCREATE}
                                        >
                                            {t("Rezervasyon")}
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="menu-item accordion-menu">
                            <span
                                className="menu-link cursor-pointer"
                                onClick={() => toggleMenu("ads-content")}
                            >
                                {t("İlan İçerikleri")}
                                <i
                                    className={`icon chevron-${openMenu === "ads-content" ? "up" : "down"}`}
                                ></i>
                            </span>
                            {openMenu === "ads-content" && (
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.CATEGORY}
                                        >
                                            {t("Araç Türleri")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.OPERATION}
                                        >
                                            {t("Araç Yakıt")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.FEATURES}
                                        >
                                            {t("Araç Özellikleri")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.RULES}
                                        >
                                            {t("Araç Kuralları")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.NEARBY}
                                        >
                                            {t("Araç Markaları")}
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.SHOWCASE}>
                                {t("Anasayfa Vitrin")}
                            </Link>
                        </li>

                        <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.REFERENCES}>
                                {t("Referanslar")}
                            </Link>
                        </li>

                        {/* <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.CAMPAIGN}>
                                {t('Kampanyalar')}
                            </Link>
                        </li> */}

                        {/* <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.COUPON}>
                                {t('Kupon')}
                            </Link>
                        </li> */}
                        {/* <li className="menu-item">
                            <Link className="menu-link" to={ROUTES.UI.REPORTS}>
                                {t('Raporlar')}
                            </Link>
                        </li> */}

                        {/* ✅ Tüm bu sayfalar "Kayıtlar" altına taşındı */}
                        <li className="menu-item accordion-menu">
                            <span
                                className="menu-link cursor-pointer"
                                onClick={() => toggleMenu("forms")}
                            >
                                {t("Kayıtlar")}
                                <i
                                    className={`icon chevron-${openMenu === "forms" ? "up" : "down"}`}
                                ></i>
                            </span>
                            {openMenu === "forms" && (
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.COMMUNICATION}
                                        >
                                            {t("İletişim Formu")}
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.SUPPORT_TICKETS}
                                        >
                                            {t("Destek Talepleri")}
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.COMMENTS}
                                        >
                                            {t("Yorumlar")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.SEO}
                                        >
                                            {t("SEO Ayarları")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.BLOG}
                                        >
                                            {t("Bloglar")}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.FAQ}
                                        >
                                            {t("Sıkça Sorulan Sorular")}
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.FVREGION}
                                        >
                                            {t("Popüler Bölgeler")}
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link
                                            className="menu-link"
                                            to={ROUTES.UI.POLICIES}
                                        >
                                            {t("Politikalar")}
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* <li className="menu-item accordion-menu">
                            <span className="menu-link cursor-pointer" onClick={() => toggleMenu("requests")}>
                                {t('İstekler')}
                                <i className={`icon chevron-${openMenu === "requests" ? "up" : "down"}`}></i>
                            </span>
                            {openMenu === "requests" && (
                                <ul className="menu-sub">
                                    <li className="menu-item">
                                        <Link className="menu-link" to={ROUTES.UI.HOME_REQUESTS}>
                                            {t('Ev İstekleri')}
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li> */}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Aside;
