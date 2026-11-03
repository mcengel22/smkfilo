import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HeaderMenu from "../../../../Components/UI/Header/HeaderMenu";
import HomeFilter from "./HomeFilter";

const HomeSlider = () => {
    const { t } = useTranslation();
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
                <div className="absolute inset-0 bg-black opacity-30" />
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
                {/* MOBILE LOGO */}
                <div className="absolute top-4 right-4 z-50 md:hidden">
                    <Link to="/">
                        <img
                            src="/img/logo/filologo.webp"
                            alt="Logo"
                            className="h-[60px] w-[160px] object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                    </Link>
                </div>
                <div className="banner">
                    <div>
                        {/* <div className="tursab">
                            <p>tatilmerasi.com Turizm Seyahat Acentası Belge No: 14735</p>
                        </div> */}
<div
    className="
        banner-inf
        !left-0 !ml-0
        !w-full
        px-4
        md:!w-full
        md:px-0
    "
>
                            <div className="text-center w-full">

                               <h1
    className="
        main-title
        mt-20
        text-center
        font-extrabold
        text-[21px]
        leading-[24px]
        text-white
        sm:text-4xl
        md:mt-10
        md:text-6xl
        md:leading-tight
        lg:text-7xl
    "
>
    {t('YOLA ÇIKMANIN EN KOLAY YOLU,')}
    <span className="text-primary block">
        {t('GÜVENİLİR ARAÇ KİRALAMA!')}
    </span>
</h1>

                                <p className="sub-title mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                                    {t('Geniş araç filomuz, uygun fiyatlarımız ve hızlı rezervasyon sistemimizle')}
                                    <span className="font-semibold text-white">
                                        {t(' istediğiniz aracı saniyeler içinde kiralayın!')}
                                    </span>
                                </p>

                            </div>
                        </div>
                        <div className="banner-filter">
                            <HomeFilter />
                        </div>
                    </div>
                </div>
            </div>
            <hr id="the_detector" style={{ opacity: 0 }} />
        </header>
    );
}


export default HomeSlider;
