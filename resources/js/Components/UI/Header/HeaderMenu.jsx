import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../../Libs/Routes/config";
import { useSelector } from "react-redux";
import { loadSwal } from "@/Libs/Global/swal.js";
import { toast } from "react-toastify";
import { useAuth } from "../../../ServerSide/Hooks/Auth/useAuth";
import Select from "react-dropdown-select";
import { useSearch } from "../../../ServerSide/Hooks/useSearch";
import { useDebounce } from "react-use";
import { useDispatch } from "react-redux";
import { setFilters, resetFilters } from "@/Repo/Redux/Modules/FilterSlice.jsx";

const HeaderMenu = ({
    menuActive,
    toggleMenu,
    subMenu,
    hideSubMenu,
    menuTitle,
    toggleSubMenu,
}) => {
    const { t } = useTranslation();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); // 👈 route değişimi yakalanacak
    const { select2Search } = useSearch();
    const { logout } = useAuth();
    const user = useSelector((state) => state.auth.user);
    const categories = useSelector((state) => state.attr.categories);
    const [options, setOptions] = useState([]);
    const grouped = { villa: [], bungalow: [] };
    const [query, setQuery] = useState("");

    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchKey, setSearchKey] = useState(Date.now()); // 👈 Select'i resetlemek için
    const [loading, setLoading] = useState(false); // ✅ Yüklenme durumu
    categories?.forEach((cat) => {
        const types = Array.isArray(cat.post_type) ? cat.post_type : [];
        if (types?.includes("villa")) grouped.villa.push(cat);
        if (types?.includes("bungalow")) grouped.bungalow.push(cat);
    });

    function splitIntoColumns(array, columnCount) {
        const result = Array.from({ length: columnCount }, () => []);
        array.forEach((item, index) => {
            result[index % columnCount].push(item);
        });
        return result;
    }

    const handleChange = (selected) => {
        if (selected.length > 0) {
            const { slug } = selected[0];
            if (slug) {
                navigate(`/Detay/${slug}`);
            } else {
                console.error("Slug eksik!");
            }
        }
    };

    const handleLogout = async () => {
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
                toast.success(t("Çıkış yapıldı 👋"));
            } catch (error) {
                console.error("Çıkış hatası:", error);
                (await loadSwal()).fire(t("Hata"), t("Çıkış yapılamadı!"), "error");
            }
        }
    };

    // ✅ Sayfa değiştiğinde search temizlensin
    useEffect(() => {
        setSearchKey(Date.now()); // 👈 Select yeniden render edilecek
        setQuery("");
        setDebouncedQuery("");
        setOptions([]);
    }, [location.pathname]);
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
                        console.warn("Beklenmeyen API yanıtı:", results);
                        setOptions([]);
                    }
                })
                .catch((error) => {
                    console.error("Arama API Hatası:", error);
                    setOptions([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setOptions([]);
            setLoading(false);
        }
    }, [debouncedQuery]);
    const toggleAccountMenu = (event) => {
        event.stopPropagation();
        setAccountMenuOpen((prevState) => !prevState);
    };

    return (
        <section className="navbar-center">
            {/* 🎨 Gömülü stil */}
            <style>
                {`
                .auth.user-info {
                    background-color: #f9f9f9;
                    padding: 16px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 10px;
                }

                .auth.user-info .user-name {
                    font-weight: 600;
                    font-size: 16px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .auth.user-info a,
                .auth.user-info button.logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 15px;
                    color: #444;
                    background: none;
                    border: none;
                    padding: 8px 10px;
                    border-radius: 8px;
                    transition: background 0.2s;
                    text-align: left;
                }

                .auth.user-info a:hover,
                .auth.user-info button.logout-btn:hover {
                    background-color: #ececec;
                    color: #000;
                }

                .auth.user-info .logout-btn {
                    cursor: pointer;
                    color: #e63946;
                }

                .auth.user-info .logout-btn:hover {
                    background-color: #ffeaea;
                }
                `}
            </style>

            <div
                className={`menu ${menuActive ? "is-active" : ""}`}
                ref={menuRef}
            >
                <span className="menu-close" onClick={toggleMenu}>
                    <i className="icon xmark"></i>
                </span>

                <div className={`menu-header ${subMenu ? "is-active" : ""}`}>
                    <span className="menu-arrow" onClick={hideSubMenu}>
                        <i className="icon chevron-right"></i>
                    </span>
                    <span className="menu-title">{menuTitle}</span>
                </div>

                <ul className="menu-inner" onClick={toggleSubMenu}>
                    <li className="menu-item">
                        <Link to={ROUTES.UI.LANDING} className="menu-link">
                            {t("Anasayfa")}
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={ROUTES.UI.ABOUT} className="menu-link">
                            {t("Hakkımızda")}
                        </Link>
                    </li>

                    <li className="menu-item">
                        <Link to={ROUTES.UI.CONTACT} className="menu-link">
                            {t("İletişim")}
                        </Link>
                    </li>
                    {/* ☀️ Kiralık türleri */}
                    {[{ key: "villa", label: "Kiralık Araçlar" }].map(
                        (item) => (
                            <li className="menu-item" key={item.key}>
                                <button
                                    className="menu-link w-full text-left"
                                    onClick={() => {
                                        toggleMenu(); // mobil menüyü kapat

                                        dispatch(resetFilters());
                                        dispatch(
                                            setFilters({ type: item.key }),
                                        );

                                        navigate(ROUTES.UI.LISTING);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    {t(item.label)}
                                </button>
                            </li>
                        ),
                    )}

                    {/* <li className="menu-item">
                        <Link
                            to={ROUTES.UI.CAPMAIGN_LISTING}
                            className="menu-link"
                        >
                            {t("Kampanyalar")}
                        </Link>
                    </li> */}
                    <li className="menu-item">
                        <Link to={ROUTES.UI.BLOG_LISTING} className="menu-link">
                            {t("Blog")}
                        </Link>
                    </li>
                    <div className="search-box block">
                        {/* <Select
                            key={searchKey} // 👈 Sayfa değişince sıfırlanır
                            options={options}
                            labelField="label"
                            placeholder="İlan İsmi İle Ara"
                            valueField="value"
                            className="searchTerm"
                            searchable={true}
                            searchFn={({ state }) => {
                                setQuery(state.search);
                                return options;
                            }}
                            loading={loading}
                            noDataLabel="Sonuç bulunamadı"
                            onChange={handleChange}
                            clearOnSelect={true}
                        /> */}
                        {/*<button type="submit" className="searchButton">*/}
                        {/*    <i className="icon search"></i>*/}
                        {/*</button>*/}
                    </div>
                    {/* Kullanıcı Bilgisi veya Giriş */}
                    <li className="menu-item desktop-none">
                        {user ? (
                            <div className="auth user-info">
                                <span className="user-name">
                                    👤 {user.name} {user.surname}
                                </span>
                                <Link to={ROUTES.UI.ACCOUNT_SETTING}>
                                    <i className="icon user"></i> {t("Hesabım")}
                                </Link>
                                <button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    <i className="icon logout"></i>{" "}
                                    {t("Çıkış Yap")}
                                </button>
                            </div>
                        ) : (
                            <div className="auth">
                                <Link to={ROUTES.AUTH.LOGIN}>
                                    <i className="icon user"></i>{" "}
                                    {t("Giriş Yap")}
                                </Link>
                                <Link to={ROUTES.AUTH.REGISTER}>
                                    <i className="icon user"></i>{" "}
                                    {t("Kayıt Ol")}
                                </Link>
                            </div>
                        )}
                    </li>

                    {/* Sosyal Medya */}
                    <li className="menu-item desktop-none">
                        <div className="social-link">
                            <a
                                href="https://instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="icon instagram"></i>
                            </a>
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="icon facebook"></i>
                            </a>
                            <a
                                href="https://youtube.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="icon youtube"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default HeaderMenu;
