import React, {useState, useEffect, useMemo, useRef} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MusteriReservationTable from "../../../../Components/UI/Misc/MusteriReservationTable";
import MusteriReservationFilter from "../../../../Components/UI/Misc/MusteriReservationFilter";
import PaginationNavigator from "../../../../Components/UI/Misc/PaginationNavigator";
import {useDispatch, useSelector} from "react-redux";
import {useReservation} from "../../../../ServerSide/Hooks/useReservation";
import {resetFilters} from "../../../../Repo/Redux/Modules/FilterSlice";
import Skeleton from "@/Components/Skeleton.jsx";

const UserReservation = () => {
    const firstRun = useRef(true);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { useMusteriReservationByFilter } = useReservation();
    // Redux slice'tan direkt filters objesini alıyoruz
    const { filters } = useSelector(state => state.filter);
    const [reservations, setReservations] = useState([]);
    const [pagination, setPagination] = useState(null);
    const isLoading = useSelector(state => state.post.loading);

    // Mount olduğunda önceki filtreleri temizle
    useEffect(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    // filters değiştiğinde tetiklenir
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return; // ilk run'ı atla
        }
        window.scrollTo(0, 0);

        (async () => {
            try {
                // Doğrudan filters objesini gönderiyoruz
                const response = await useMusteriReservationByFilter(filters);
                setReservations(response?.data || []);
                setPagination(response?.pagination || []);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [filters]);  // <-- sadece filters değişince çalışır

    return (
        <div className="rezervasyonlar-sayfasi">
            <div className="rezervasyon-header">
                <div className="sol-kisim">
                    <h2>{t('Rezervasyonlarım')}</h2>
                    <div className="istatistikler">
                        {/*
                            <div className="istatistik-item">
                                {isLoading
                                    ?
                                    <Skeleton height="35px" width="40px" />
                                    : (
                                        <span className="sayi">1</span>
                                    )}
                                <span className="etiket">{t('Aktif Rezervasyon')}</span>
                            </div>
                        */}
                        <div className="istatistik-item">
                            {isLoading
                                ?
                                    <Skeleton height="35px" width="40px" />
                                : (
                                    <span className="sayi">{pagination?.total || 0}</span>
                                )}
                            <span className="etiket">{t('Toplam Rezervasyon')}</span>
                        </div>
                    </div>
                </div>
                <MusteriReservationFilter />
            </div>
            <MusteriReservationTable reservations={reservations} />
            <PaginationNavigator pagination={pagination} />
        </div>
    );
};

export default UserReservation;
