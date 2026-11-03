// ReservationFilter.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { updateFilters, changePage } from "../../../Repo/Redux/Modules/FilterSlice";

const ReservationFilter = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { status, state } = useSelector(s => s.filter.filters);

    const onStatusChange = e => {
        const value = e.target.value || null;      // "" → null
        dispatch(updateFilters({ status: value }));
        dispatch(changePage(1));
    };

    const onStateChange = e => {
        const value = e.target.value || null;
        dispatch(updateFilters({ state: value }));
        dispatch(changePage(1));
    };

    return (
        <div className="filter-wrap">
            <select
                className="arrangement-filter me-3"
                value={status ?? ""}
                onChange={onStatusChange}
            >
                <option value="">{t("Tümünü Göster")}</option>
                <option value="pending">{t("Bekleyenler")}</option>
                <option value="confirmed">{t("Onaylılar")}</option>
                <option value="canceled">{t("İptal Edilenler")}</option>
            </select>

            <select
                className="arrangement-filter"
                value={state ?? ""}
                onChange={onStateChange}
            >
                <option value="">{t("Zaman Durumu")}</option>
                <option value="waiting">{t("Henüz Başlamadı")}</option>
                <option value="active">{t("Şu An Konaklıyor")}</option>
                <option value="finished">{t("Geçmiş")}</option>
            </select>
        </div>
    );
};

export default ReservationFilter;
