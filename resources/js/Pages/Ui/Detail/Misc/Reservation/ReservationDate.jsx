"use client";
import { useState, useRef, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import { tr } from "date-fns/locale";
import DatePicker from "../Calendar/Calendar";
import { useSelector, useDispatch} from 'react-redux';
import { setSelectedDates } from '../../../../../Repo/Redux/Modules/ReservationSlice'; // Bu import path'ini projenize göre ayarlayın


const ReservationDate = ({ data, onDateSelect }) => {

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const selectedDates = useSelector(state => state.reservation.selectedDates);

    const [isInitialized, setIsInitialized] = useState(false);
    const wrapperRef = useRef(null);

    // Dışarı tıklandığında date picker'ı kapat
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Gelen tarihleri doğru formata dönüştür
    const ensureDateObject = (date) => {
        if (!date) return null;

        // Eğer tarih zaten bir Date nesnesi ise
        if (date instanceof Date && !isNaN(date)) return date;

        // Eğer tarih bir string ise
        if (typeof date === 'string') {
            try {
                const parsedDate = parseISO(date);
                if (isValid(parsedDate)) return parsedDate;
            } catch (e) {
                console.error("Tarih ayrıştırma hatası:", e);
            }
        }

        // Eğer tarih bir timestamp ise
        if (typeof date === 'number') {
            try {
                const dateFromNumber = new Date(date);
                if (isValid(dateFromNumber)) return dateFromNumber;
            } catch (e) {
                console.error("Timestamp'ten tarih oluşturma hatası:", e);
            }
        }

        return null;
    };

    // Tarih seçim bilgisini dışarı aktar
    useEffect(() => {
        if (!isInitialized) return;

        const start = ensureDateObject(selectedDates.start);
        const end = ensureDateObject(selectedDates.end);

        if (start && end) {
            onDateSelect({ start, end });
        }
    }, [onDateSelect, isInitialized]);

    // Tarih seçim işleyicisi
    const handleDateSelect = (dates) => {
        if (!dates) return;

        const start = ensureDateObject(dates.start);
        const end = ensureDateObject(dates.end);

        if (start || end) {
            // Redux store'u güncelle
            dispatch(setSelectedDates({
                start: start ? start.toISOString() : null,
                end: end ? end.toISOString() : null
            }));
        }
    };


    // Güvenli format fonksiyonu
    const safeFormat = (date, formatStr) => {
        const dateObj = ensureDateObject(date);

        if (dateObj) {
            try {
                return format(dateObj, formatStr, { locale: tr });
            } catch (e) {
                console.error("Format hatası:", e);
            }
        }

        return "Seçiniz";
    };

    return (
        <div className="date-picker-v2" ref={wrapperRef}>
            <div className="date-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="date-info">
                    <div className="date-section">
                        <label>Giriş</label>
                        <div className="selected-date">
                            {safeFormat(selectedDates.start, "d MMMM")}
                        </div>
                    </div>
                    <div className="date-section">
                        <label>Çıkış</label>
                        <div className="selected-date">
                            {safeFormat(selectedDates.end, "d MMMM")}
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="calendar-wrapper">
                    <DatePicker
                        data={data}
                        onDateSelect={handleDateSelect}
                        className="reservation-date-picker"
                        initialSelectedRange={{
                            start: ensureDateObject(selectedDates.start),
                            end: ensureDateObject(selectedDates.end)
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ReservationDate;
