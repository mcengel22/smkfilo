import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../Libs/Routes/config";
import Select from "react-dropdown-select";
import { useSearch } from "../../../../ServerSide/Hooks/useSearch";
import { useDebounce } from "react-use";
import { useSelector } from "react-redux";
import { useAuth } from "../../../../ServerSide/Hooks/Auth/useAuth";
import { loadSwal } from "@/Libs/Global/swal.js";
import { toast } from "react-toastify";

const TopHeader = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKey, setSearchKey] = useState(Date.now());

    const { select2Search } = useSearch();
    const { logout } = useAuth();
    const user = useSelector((state) => state.auth.user);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });

    useDebounce(
        () => {
            setDebouncedQuery(query);
        },
        400,
        [query],
    );

    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            setLoading(true);

            select2Search(debouncedQuery)
                .then((results) => {
                    if (Array.isArray(results)) {
                        const formatted = results
                            .filter((item) =>
                                item.text
                                    .toLowerCase()
                                    .includes(query.toLowerCase()),
                            )
                            .map((item) => ({
                                value: item.id,
                                label: item.text,
                                slug: item.slug,
                                type: "ilan",
                            }));

                        setOptions(formatted);
                    } else {
                        setOptions([]);
                    }
                })
                .catch(() => setOptions([]))
                .finally(() => setLoading(false));
        } else {
            setOptions([]);
            setLoading(false);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        setSearchKey(Date.now());
        setQuery("");
        setDebouncedQuery("");
        setOptions([]);
    }, [location.pathname]);

    const handleChange = (selected) => {
        if (selected.length > 0) {
            const { slug } = selected[0];

            if (slug) {
                navigate(`/Detay/${slug}`);
            }
        }
    };

    const toggleAccountMenu = (event) => {
        event.stopPropagation();
        setAccountMenuOpen((prev) => !prev);
    };

    const closeAllMenus = () => setAccountMenuOpen(false);

    const handleClickOutside = useCallback((event) => {
        if (
            accountMenuRef.current &&
            !accountMenuRef.current.contains(event.target)
        ) {
            closeAllMenus();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleLogout = async (e) => {
        e.preventDefault();

        const result = await (await loadSwal()).fire({
            title: t("Emin misiniz?"),
            text: t("Çıkış yapmak üzeresiniz."),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("Evet, çıkış yap"),
            cancelButtonText: t("İptal"),
        });

        if (result.isConfirmed) {
            try {
                await logout();
                navigate(ROUTES.AUTH.LOGIN);
                toast.success(t("Çıkış yapıldı 👋"));
            } catch {
                (await loadSwal()).fire(t("Hata"), t("Çıkış yapılamadı!"), "error");
            }
        }
    };

    return (
        <div className="top-bar">
            <div className="mx-auto px-3 sm:px-4 md:px-4">
                <div className="top-menu">
                    <div className="wrap">
                        <Link
                            to={ROUTES.UI.LANDING}
                            className="top-header-logo"
                            onClick={scrollToTop}
                        >
                            <img
                                src="/img/logo/smklogo.webp"
                                alt="SMK Filo"
                                width="150"
                                height="54"
                            />
                        </Link>

                        <span className="top-tagline">
                            <span className="top-tagline-dot" />
                            {t("Araç Kiralamada")}{" "}
                            <span className="top-tagline-muted">{t("Lider Filo")}</span>
                        </span>
                    </div>

                    <div className="right-side flex items-center gap-3">
                        {/*<button className="btn btn-primary mr-2">*/}
                        {/*    Kupon Satın Al*/}
                        {/*</button>*/}

                        {/* <button className="account-menu-button btn-top">
                            <Link to={ROUTES.UI.RESERVATİON_MANAGEMENT}>
                                Rezervasyon Sorgulama
                            </Link>
                        </button> */}

                        <a href="tel:+905305421233" className="top-phone" aria-label={t("Bizi arayın")}>
                            <i className="icon call" />
                            <span>+90 530 542 12 33</span>
                        </a>

                        {/* {user && (
                            <div className="me-2">
                                <Link
                                    to={ROUTES.UI.RESERVATIONSLIST}
                                    className="btn btn-top"
                                >
                                    {t("Rezervasyonlarım")}
                                </Link>
                            </div>
                        )} */}

                        <div
                            ref={accountMenuRef}
                            className="account-menu-container me-2"
                        >
                            <button
                                className="account-menu-button btn-top"
                                onClick={toggleAccountMenu}
                            >
                                {t("Menü")}
                            </button>

                            {accountMenuOpen && (
                                <div className="account-menu">
                                    <div className="admin-info">
                                        {user ? (
                                            <>
                                                <Link
                                                    to={
                                                        ROUTES.UI
                                                            .ACCOUNT_SETTING
                                                    }
                                                >
                                                    {t("Hesabım")}
                                                </Link>
                                                <Link
                                                    to="#"
                                                    onClick={handleLogout}
                                                >
                                                    {t("Çıkış Yap")}
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link to={ROUTES.AUTH.LOGIN}>
                                                    {t("Giriş Yap")}
                                                </Link>
                                                <Link to={ROUTES.AUTH.REGISTER}>
                                                    {t("Kayıt Ol")}
                                                </Link>
                                            </>
                                        )}

                                        <Link to={ROUTES.UI.CONTACT}>
                                            {t("İletişim")}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
