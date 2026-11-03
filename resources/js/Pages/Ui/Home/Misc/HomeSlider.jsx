import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeaderMenu from "../../../../Components/UI/Header/HeaderMenu";
import { ROUTES } from "../../../../Libs/Routes/config";
import { updateFilters } from "../../../../Repo/Redux/Modules/FilterSlice";

const HomeSlider = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const filters = useSelector((state) => state.filter.filters);

    // Listing sayfası ilan tipini (type) bekliyor; ilk girişte tek istek atılsın diye burada set ediliyor
    const goToListing = () => {
        dispatch(updateFilters({ type: filters?.type || "villa", pagination: { pageNumber: 1 } }));
        navigate(ROUTES.UI.LISTING);
    };
    const [menuActive, setMenuActive] = useState(false);
    const [subMenu, setSubMenu] = useState(null);
    const [menuTitle, setMenuTitle] = useState("");
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuActive((prev) => !prev);
    };

    const showSubMenu = (children) => {
        const submenuElement = children.querySelector(".submenu");
        setSubMenu(submenuElement);
        submenuElement.classList.add("is-active");
        submenuElement.style.animation = "slideLeft 0.35s ease forwards";
        const title = children
            .querySelector(".menu-link")
            .childNodes[0].textContent.trim();
        setMenuTitle(title);
    };

    const hideSubMenu = () => {
        if (subMenu) {
            subMenu.style.animation = "slideRight 0.35s ease forwards";
            setTimeout(() => {
                subMenu.classList.remove("is-active");
                setSubMenu(null);
            }, 300);
        }
        setMenuTitle("");
    };

    const toggleSubMenu = (e) => {
        if (!menuActive) return;

        const dropdown = e.target.closest(".menu-dropdown");
        if (dropdown) {
            showSubMenu(dropdown);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && menuActive) {
                setMenuActive(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [menuActive]);

    return (
        <header id="banner">
            <div id="page">
                {/* 1️⃣ Ön planda fallback görseli */}
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: "url(/img/banner/rentacar.webp)" }}
                />
                <div className="hero-overlay" />
                {/*/!* 2️⃣ Poster atributeli video *!/*/}
                {/*<video*/}
                {/*    poster="/img/banner/fallback.png"*/}
                {/*    preload="auto"*/}
                {/*    autoPlay*/}
                {/*    loop*/}
                {/*    muted*/}
                {/*    playsInline*/}
                {/*    className="absolute inset-0 w-full h-full object-cover"*/}
                {/*>*/}
                {/*    <source src="/img/banner/homeslider.mp4" type="video/mp4" />*/}
                {/*</video>*/}
                <div
                    id="overlay"
                    className={`header-overlay ${menuActive ? "is-active" : ""}`}
                    onClick={toggleMenu}
                ></div>
                <div className="menu-wrapper">
                    <div className="w-full mx-auto">
                        <nav className="navbar px-3 sm:px-4 md:px-4">
                            <section className="navbar-left">
                                {/* <div className="logo" style={{ cursor: "pointer" }}>
                                    <img
                                        src="/img/logo/filologo.webp"
                                        alt="Logo"
                                        style={{
                                            width: "110px",
                                            height: "auto",
                                            maxHeight: "80px",
                                            objectFit: "contain",
                                            display: "block",
                                        }}
                                    />
                                </div> */}

                                <div className="burger" onClick={toggleMenu}>
                                    <span className="burger-line"></span>
                                    <span className="burger-line"></span>
                                    <span className="burger-line"></span>
                                </div>
                            </section>
                            <HeaderMenu
                                menuActive={menuActive}
                                toggleMenu={toggleMenu}
                                subMenu={subMenu}
                                hideSubMenu={hideSubMenu}
                                toggleSubMenu={toggleSubMenu}
                                menuRef={menuRef}
                                menuTitle={menuTitle}
                            />
                        </nav>
                    </div>
                </div>
                {/* Mobil logo artık üst barda (renkli) gösteriliyor */}
                <div className="hero">
                    <div className="hero-inner">
                        <span className="hero-eyebrow">
                            <i className="icon check" />
                            {t("SMK Filo Araç Kiralama")}
                        </span>

                        <h1 className="hero-title">
                            {t("Yola çıkmanın en kolay yolu,")}
                            <span>{t("güvenilir araç kiralama")}</span>
                        </h1>

                        <p className="hero-text">
                            {t("Geniş araç filomuz, uygun fiyatlarımız ve hızlı rezervasyon sistemimizle istediğiniz aracı saniyeler içinde kiralayın.")}
                        </p>

                        <div className="hero-actions">
                            <button type="button" className="hero-btn hero-btn--primary" onClick={goToListing}>
                                <i className="icon search" />
                                {t("Tüm Araçları İncele")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr id="the_detector" style={{ opacity: 0 }} />
        </header>
    );
}


export default HomeSlider;
