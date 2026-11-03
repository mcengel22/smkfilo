import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { updateFilters, changePage } from "../../../Repo/Redux/Modules/FilterSlice";
import {Link} from "react-router-dom";

const MusteriReservationFilter = () => {
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
        <div className="sag-kisim">
            <div className="arama-filtre">
                {
                    /*
                    <div className="arama-kutusu">
                      <svg
                        className="arama-ikonu"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        stroke="currentColor"
                        fill="none"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Rezervasyon no veya müşteri adı ile ara"
                        value="test"
                      />
                    </div>
                    */
                }
                <select className="durum-filtresi" value={status ?? ""} onChange={onStatusChange}>
                    <option value="">{t("Tümünü Göster")}</option>
                    <option value="confirmed">{t('Onaylanan')}</option>
                    <option value="pending">{t('Onay Bekleyen')}</option>
                    <option value="canceled">{t('İptal Edilen')}</option>
                </select>

                <select className="durum-filtresi" value={state ?? ""} onChange={onStateChange}>
                    <option value="">{t("Zaman Durumu")}</option>
                    <option value="waiting">{t('Bekliyor')}</option>
                    <option value="active">{t('Konaklıyor')}</option>
                    <option value="finished">{t('Tamamlandı')}</option>
                </select>

                <div>
                    <Link to="/create-reservation" className="btn">
                        {t('Oluştur')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MusteriReservationFilter;
