// ReservationList.jsx

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReservationTable from "../../../../../Components/UI/Misc/ReservationTable";
import ReservationFilter from "../../../../../Components/UI/Misc/ReservationFilter";
import { useReservation } from "../../../../../ServerSide/Hooks/useReservation";
import { useDispatch, useSelector } from "react-redux";
import { resetFilters } from "../../../../../Repo/Redux/Modules/FilterSlice";
import PaginationNavigator from "../../../../../Components/UI/Misc/PaginationNavigator";

const ReservationList = () => {
    const firstRun = useRef(true);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // hook içinden sadece filtreleme fonksiyonunu çekiyoruz
    const { useReservationByFilter } = useReservation();

    // Redux slice'tan direkt filters objesini alıyoruz
    const { filters } = useSelector((state) => state.filter);

    const [reservations, setReservations] = useState([]);
    const [pagination, setPagination] = useState(null);

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
                const response = await useReservationByFilter(filters);
                setReservations(response?.data || []);
                setPagination(response?.pagination || []);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [filters]); // <-- sadece filters değişince çalışır

    const handleStatusUpdate = (updatedReservation) => {
        setReservations((prev) =>
            prev.map((r) =>
                r.id === updatedReservation.id
                    ? {
                          ...r,
                          status: updatedReservation.status,
                          state: updatedReservation.state ?? r.state, // eğer döndüyse yeni state’i de al
                      }
                    : r,
            ),
        );
    };
    const updateOneReservation = (updatedReservation) => {
        setReservations((prev) =>
            prev.map((r) =>
                r.id === updatedReservation.id
                    ? { ...r, ...updatedReservation }
                    : r,
            ),
        );
    };

    const removeReservation = (id) => {
        setReservations((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div>
            <div className="title">
                <h1>{t("Rezervasyonlar")}</h1>
            </div>
            <div className="card">
                <div className="card-header">
                    <ReservationFilter />
                </div>
                <div className="card-body">
                    <ReservationTable
                        reservations={reservations}
                        onStatusUpdate={updateOneReservation}
                        onDelete={removeReservation}
                    />
                    <PaginationNavigator pagination={pagination} />
                </div>
            </div>
        </div>
    );
};

export default ReservationList;
