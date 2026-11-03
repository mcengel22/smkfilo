import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import {ROUTES} from "@/Libs/Routes/config.jsx";

const Header = () => {
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
        <div className="inner-page detail-page">
            <header>
                <div
                    id="overlay"
                    className={`header-overlay ${menuActive ? "is-active" : ""}`}
                    onClick={toggleMenu}
                ></div>
                <div className="menu-wrapper">
                    <div className="mx-auto">
                        <nav
                            className="navbar px-3 sm:px-4 md:px-4"
                            style={{ background: "none" }}
                        >
                            <section className="navbar-left">

                                {/* <Link to={ROUTES.UI.LANDING} className="logo" style={{ cursor: 'pointer', display: 'block' }}>
                                <img
                                    src="/img/logo/filologo.webp"
                                    alt="Logo"
                                    width={200}
                                    height={50}
                                />
                            </Link> */}

                                <div className="burger" onClick={toggleMenu}>
                                    <span className="burger-line"></span>
                                    <span className="burger-line"></span>
                                    <span className="burger-line"></span>
                                </div>
                            </section>
                            {/* Yeni NavbarCenter Componenti */}
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
            </header>
        </div>
    );

}


export default Header;
