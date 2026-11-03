import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import FilterCard from "./FilterCard";
import { ATTRS } from "../../../../Libs/Global/attrs";
import { usePost } from "../../../../ServerSide/Hooks/usePost";
import { resetFilters, updateFilters } from "../../../../Repo/Redux/Modules/FilterSlice";
import { isEmpty } from "lodash";

const Sidebar = () => {
    const { t } = useTranslation();
    const { setPostsByFilter, setPosts } = usePost();
    const dispatch = useDispatch();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [stopSticky, setStopSticky] = useState(false);

    const stickyWrapperRef = useRef(null);
    const stickyInnerRef = useRef(null);

    const attrs = useSelector((state) => state.attr);
    const filter = useSelector((state) => state.filter);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleScroll = () => {
        if (window.innerWidth < 992) {
            setIsSticky(false);
            setStopSticky(false);
            return;
        }

        const stopEl = document.getElementById("sticky-stop-point");
        if (!stickyWrapperRef.current || !stickyInnerRef.current || !stopEl) return;

        const wrapperTop = stickyWrapperRef.current.getBoundingClientRect().top;
        const stopBottom = stopEl.getBoundingClientRect().top;
        const stickyHeight = stickyInnerRef.current.offsetHeight;

        const shouldStick = wrapperTop <= 20;
        const shouldStop = stopBottom <= stickyHeight + 80; // 🔥 SEO’ya binmemesi için mesafe artırıldı

        setIsSticky(shouldStick && !shouldStop);
        setStopSticky(shouldStick && shouldStop);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const getPostwFilter = async () => {
        if (isEmpty(filter.filters)) return;
        try {
            window.scrollTo(0, 0);
            await setPostsByFilter(filter.filters);
        } catch (error) {
            console.error(error);
        }
    };

    const clearPostFilter = async () => {
        if (isEmpty(filter.filters)) return;
        try {
            window.scrollTo(0, 0);
            await dispatch(resetFilters());
            setPostsByFilter(null);
        } catch (err) {
            console.error("Filter temizleme hatası:", err);
        }
    };

    const handleInputChange = (name, value) => {
        const updatedDetail = {
            ...filter.filters.detail,
            [name]: value,
        };

        dispatch(
            updateFilters({
                detail: updatedDetail,
            })
        );
    };

    const handleSearchChange = (value) => {
        dispatch(
            updateFilters({
                search: value,
            })
        );
    };

    return (
        <>
            <div className="flex items-center">
                <button className="filter-button me-2" onClick={toggleSidebar}>
                    {t("Filtrele")}
                </button>
            </div>

            <div
                className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
                onClick={closeSidebar}
            />

            <div id="open-sidebar" className={`open-sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <button className="close-button" onClick={closeSidebar}>
                        <i className="icon xmark" />
                        <span>{t("Kapat")}</span>
                    </button>
                    <span>{t("Filtrele")}</span>
                </div>

                <div className="sidebar">
                    <div className="card">
                        <div className="card-title">
                            <h4>
                                <i className="icon search" /> {t("Ara")}
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder={t("Araç adı ile ara")}
                                    value={filter.filters.search ?? ""}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn search-btn"
                                    onClick={() => getPostwFilter()}
                                >
                                    <i className="icon search" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {ATTRS().map(({ key, value }, index) => (
                        <FilterCard key={index} title={value} icon="gilding" items={attrs[key]} />
                    ))}

                    <div ref={stickyWrapperRef} style={{ position: "relative", height: "auto" }}>
                        <div
                            ref={stickyInnerRef}
                            className={`transition-all duration-300 ${
                                isSticky && !stopSticky
                                    ? "fixed top-4 z-50 bg-white shadow-md"
                                    : ""
                            } ${
                                stopSticky
                                    ? "absolute z-50 bg-white shadow-md"
                                    : ""
                            }`}
                            style={{
                                ...(isSticky || stopSticky
                                    ? { minWidth: "410px", borderRadius: "12px" }
                                    : {}),
                                ...(stopSticky ? { top: "auto", bottom: "0px" } : {}),
                            }}
                        >
                            {/* <div className="card">
                                <div className="card-body">
                                    <ul className="room-review">
                                        <li>
                                            <span>
                                                <i className="icon room" /> {t("Oda Sayısı")}
                                            </span>
                                            <input
                                                name="room"
                                                className="form-control"
                                                type="number"
                                                value={filter.filters.detail?.room_count || 0}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "room_count",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </li>

                                        <li>
                                            <span>
                                                <i className="icon bed" /> {t("Yatak Sayısı")}
                                            </span>
                                            <input
                                                name="bed"
                                                className="form-control"
                                                type="number"
                                                value={filter.filters.detail?.bed_count || 0}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "bed_count",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </li>

                                        <li>
                                            <span>
                                                <i className="icon bath" /> {t("Banyo Sayısı")}
                                            </span>
                                            <input
                                                name="bath"
                                                className="form-control"
                                                type="number"
                                                value={filter.filters.detail?.bathroom_count || 0}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "bathroom_count",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                        </li>

                                        <li>
                                            <span>
                                                <i className="icon bath" /> {t("Minimum Fiyat")}
                                            </span>
                                            <input
                                                name="minPrice"
                                                type="range"
                                                className="form-control"
                                                min="0"
                                                max="50000"
                                                step="100"
                                                value={filter.filters.detail?.minPrice || 0}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "minPrice",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                            <span>{filter.filters.detail?.minPrice || 0} TL</span>
                                        </li>

                                        <li>
                                            <span>
                                                <i className="icon bath" /> {t("Maximum Fiyat")}
                                            </span>
                                            <input
                                                name="maxPrice"
                                                type="range"
                                                className="form-control"
                                                min="0"
                                                max="50000"
                                                step="100"
                                                value={filter.filters.detail?.maxPrice || 0}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "maxPrice",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                            />
                                            <span>{filter.filters.detail?.maxPrice || 0} TL</span>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}

                            <div className="sidebar-btn m-2">
                                <button
                                    className="action-button btn clear-btn me-2"
                                    onClick={clearPostFilter}
                                >
                                    {t("Temizle")}
                                </button>
                                <button
                                    className="action-button btn apply-btn"
                                    onClick={getPostwFilter}
                                >
                                    {t("Uygula")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
