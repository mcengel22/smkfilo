import React, { useState, useEffect } from "react";
import HomeTabs from "./HomeTabs";
import { setFilters,resetFilters } from '../../../../Repo/Redux/Modules/FilterSlice';
import { useDispatch, useSelector } from "react-redux";

const tabTitles = {
    villa: "Villa",
    bungalow: "Bungalov",
    boat: "Yat"
};

const HomeFilter = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filter.filters);

    const [activeTab, setActiveTab] = useState(filters.type || "villa");

    // İlk yüklemede filters.type boşsa "villa" olarak ayarla
    useEffect(() => {
        if (!filters.type) {
            dispatch(setFilters({ ...filters, type: "villa" }));
        }
    }, []);

    const handleFilterChange = (filter) => {
        // Aynı tab'a tekrar tıklanıyorsa işlem yapma
        if (filter === activeTab) return;

        // Önce filtreleri temizle
        dispatch(resetFilters());

        // Ardından yeni type'ı ayarla
        dispatch(setFilters({ type: filter }));

        // Lokal state güncelle
        setActiveTab(filter);
    };

    return (
        <div className="banner-search" id="bannerSearch">
            {/* <div className="banner-tab">
                <ul className="nav nav-tabs flex justify-center" role="tablist">
                    {Object.keys(tabTitles).map((tab) => (
                        <li className="nav-item" role="presentation" key={tab}>
                            <button
                                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                onClick={() => handleFilterChange(tab)}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                            >
                                <span>{tabTitles[tab]}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div> */}

            <div className="tab-content mt-1">
                <div className="booking-sec">
                    <div className="max-w-6xl mx-auto sm:px-2 my-10 md:px-2 px-3 w-full">
                        <HomeTabs activeTab={activeTab} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeFilter;
