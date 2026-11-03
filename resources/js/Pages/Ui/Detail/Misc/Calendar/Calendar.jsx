"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    format,
    addMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isWithinInterval,
    isSameDay,
    addDays,
    startOfDay,
    startOfWeek,
    isBefore,
    differenceInDays,
    parseISO
} from "date-fns";
import { tr } from "date-fns/locale";
import {
    setSelectedDates,
    setTotalPrice,
    setNightPrices,
    setTotalNights,
    setCleaningFee
} from "../../../../../Repo/Redux/Modules/ReservationSlice";

const DatePicker = ({ data, onDateSelect, initialSelectedRange }) => {
    const dispatch = useDispatch();

    // Redux store'dan tarihleri ve ilgili bilgileri alalım
    const reduxSelectedDates = useSelector(state => state.reservation.selectedDates);
    // Post detayından temizlik ücreti koşullarını al
    const details = useSelector(state => state.post.detail?.details || []);


    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

    const nextMonth = useMemo(() => addMonths(currentDate, 1), [currentDate]);

    // Redux'tan gelen tarihleri Date nesnelerine dönüştür
    const selectedRange = useMemo(() => {
        const startDate = reduxSelectedDates?.start ? parseISO(reduxSelectedDates.start) : null;
        const endDate = reduxSelectedDates?.end ? parseISO(reduxSelectedDates.end) : null;
        return { start: startDate, end: endDate };
    }, [reduxSelectedDates]);

    const showError = useCallback((message) => {
        setErrorMessage(message);
        // Redux'taki tarihleri sıfırla
        dispatch(setSelectedDates({ start: null, end: null }));
        setTimeout(() => setErrorMessage(""), 3000);
    }, [dispatch]);

    // Fiyat ve minimum gün bilgilerini ayır
    const { priceMap, minDaysMap } = useMemo(() => {
        const priceMap = {};
        const minDaysMap = {};

        (data?.prices || []).forEach(({ start_date, end_date, price, min_days }) => {
            const start = new Date(start_date);
            const end = new Date(end_date);
            const current = new Date(start);

            while (current <= end) {
                const dateKey = format(current, "yyyy-MM-dd");
                priceMap[dateKey] = parseFloat(price);
                minDaysMap[dateKey] = min_days;
                current.setDate(current.getDate() + 1);
            }
        });

        return { priceMap, minDaysMap };
    }, [data?.prices]);

    const calculateAndSetTotalPrice = useCallback((startDate, endDate) => {
        if (!startDate || !endDate || !priceMap || Object.keys(priceMap).length === 0) return null;

        let totalPrice = 0;
        const nightPrices = [];
        const nights = differenceInDays(endDate, startDate);

        let current = startDate;
        while (current < endDate) {
            const dateKey = format(current, "yyyy-MM-dd");
            const price = priceMap[dateKey] || 0;

            totalPrice += price;
            nightPrices.push({
                date: dateKey,
                price
            });

            current = addDays(current, 1);
        }

        // Redux'a toplam fiyat verilerini göndermeyi durduruyoruz (Paket sistemi kullanıldığı için)
        // dispatch(setTotalPrice(totalPrice));
        // dispatch(setNightPrices(nightPrices));
        // dispatch(setTotalNights(nights));

        // const cleaningFeeDayItem = details.find(d => d.key === "cleaning_fee_days");
        // const cleaningFeeItem = details.find(d => d.key === "cleaning_fee");

        // const minNightsForFreeCleaning = parseInt(cleaningFeeDayItem?.value || "0", 10);
        // const cleaningFee = parseFloat(cleaningFeeItem?.value || "0");

        // // Eğer kalınan gece sayısı, koşulu sağlıyorsa temizlik ücreti sıfırdır
        // const finalCleaningFee = nights >= minNightsForFreeCleaning ? 0 : cleaningFee;

        // dispatch(setCleaningFee(finalCleaningFee));

        return {
            totalPrice,
            nightPrices,
            nights
        };
    }, [dispatch, priceMap]);


    // İlk render ve veri değişimi durumunda sadece bir kez çalışacak
    // Başlangıç değerlerini ayarla
    useEffect(() => {
        if (isInitialized || !data) return; // Zaten başlatıldıysa veya data yoksa çıkış yap

        // initialSelectedRange'i kontrol et
        if (initialSelectedRange?.start && initialSelectedRange?.end && (!reduxSelectedDates?.start || !reduxSelectedDates?.end)) {
            try {
                const startDate = new Date(initialSelectedRange.start);
                const endDate = new Date(initialSelectedRange.end);

                if (startDate && endDate) {
                    // Takvim görünümünü başlangıç tarihini gösterecek şekilde ayarla
                    const currentMonthStart = startOfMonth(currentDate);
                    const currentMonthEnd = endOfMonth(currentDate);

                    if (startDate < currentMonthStart || startDate > currentMonthEnd) {
                        setCurrentDate(startOfMonth(startDate));
                    }

                    // initialSelectedRange değerlerini Redux'a kaydet
                    dispatch(setSelectedDates({
                        start: format(startDate, 'yyyy-MM-dd'),
                        end: format(endDate, 'yyyy-MM-dd')
                    }));
                }
            } catch (e) {
                console.error("Date parsing error:", e);
            }
        }
        // Redux'tan gelen verileri kontrol et ve görünümü ayarla
        else if (reduxSelectedDates?.start && reduxSelectedDates?.end) {
            try {
                const startDate = parseISO(reduxSelectedDates.start);
                const endDate = parseISO(reduxSelectedDates.end);

                if (startDate && endDate) {
                    // Takvim görünümünü başlangıç tarihini gösterecek şekilde ayarla
                    const currentMonthStart = startOfMonth(currentDate);
                    const currentMonthEnd = endOfMonth(currentDate);

                    if (startDate < currentMonthStart || startDate > currentMonthEnd) {
                        setCurrentDate(startOfMonth(startDate));
                    }
                }
            } catch (e) {
                console.error("Date parsing error:", e);
            }
        }

        setIsInitialized(true); // Başlatma işlemini tamamla
    }, [initialSelectedRange, reduxSelectedDates, data, currentDate, isInitialized, dispatch]);

    // Seçili tarihler değiştiğinde fiyatı hesapla (sadece başlatma sonrası)
    useEffect(() => {
        if (!isInitialized || !selectedRange.start || !selectedRange.end) return;

        // Fiyatları ve gecelik bilgileri güncelle
        calculateAndSetTotalPrice(selectedRange.start, selectedRange.end);
    }, [isInitialized, selectedRange.start, selectedRange.end, calculateAndSetTotalPrice]);

    // Rezervasyon tarihlerini date bilgisine dönüştür
    const convertReservationsToDateInfo = useCallback((reservations = []) => {
        const dateInfo = new Map();

        reservations.forEach((reservation) => {
            const checkIn = new Date(reservation.check_in);
            const checkOut = new Date(reservation.check_out);

            // Check-in günü
            const checkInKey = format(checkIn, "yyyy-MM-dd");
            const existingInfo = dateInfo.get(checkInKey);

            if (existingInfo?.isCheckOut) {
                dateInfo.set(checkInKey, {
                    type: "shared",
                    firstType: existingInfo.type,
                    secondType: reservation.status,
                    isSharedDay: true,
                    firstReservationId: existingInfo.reservationId,
                    secondReservationId: reservation.id,
                    isSelectable: true,
                });
            } else {
                dateInfo.set(checkInKey, {
                    type: reservation.status,
                    isCheckIn: true,
                    isCheckOut: false,
                    reservationId: reservation.id,
                    isSelectable: true,
                });
            }

            // Ara günler
            let currentDate = addDays(checkIn, 1);
            while (isBefore(currentDate, checkOut)) {
                const dateKey = format(currentDate, "yyyy-MM-dd");
                dateInfo.set(dateKey, {
                    type: reservation.status,
                    isCheckIn: false,
                    isCheckOut: false,
                    reservationId: reservation.id,
                    isSelectable: false,
                });
                currentDate = addDays(currentDate, 1);
            }

            // Check-out günü
            const checkOutKey = format(checkOut, "yyyy-MM-dd");
            const nextDayInfo = dateInfo.get(checkOutKey);

            if (nextDayInfo?.isCheckIn) {
                dateInfo.set(checkOutKey, {
                    type: "shared",
                    firstType: reservation.status,
                    secondType: nextDayInfo.type,
                    isSharedDay: true,
                    firstReservationId: reservation.id,
                    secondReservationId: nextDayInfo.reservationId,
                    isSelectable: true,
                });
            } else {
                dateInfo.set(checkOutKey, {
                    type: reservation.status,
                    isCheckIn: false,
                    isCheckOut: true,
                    reservationId: reservation.id,
                    isSelectable: true,
                });
            }
        });

        return dateInfo;
    }, []);

    const dateInfo = useMemo(
        () => (data ? convertReservationsToDateInfo(data.reservations) : new Map()),
        [data, convertReservationsToDateInfo]
    );

    // Tarih durumlarını belirle
    const isDateInPast = useCallback((date) => {
        const today = startOfDay(new Date());
        return isBefore(date, today);
    }, []);

    const getDateStatus = useCallback((date) => {
        if (isDateInPast(date)) {
            return { type: "past", isSelectable: false };
        }

        const dateKey = format(date, "yyyy-MM-dd");
        const info = dateInfo.get(dateKey);
        const price = priceMap[dateKey];

        if (!price) {
            return { type: "no-price", isSelectable: false };
        }

        if (!info) {
            return { type: "available", isSelectable: true };
        }

        return {
            ...info,
            isSelectable: info.isSelectable,
        };
    }, [dateInfo, isDateInPast, priceMap]);

    // Tarihin CSS sınıfını hesapla
    const getDateClassName = useCallback((date) => {
        const status = getDateStatus(date);
        const classes = ["calendar-day"];

        if (status.isSharedDay) {
            classes.push("shared-day");
            classes.push(`shared-${status.firstType}-${status.secondType}`);
        } else {
            if (status.type === "confirmed") classes.push("reserved");
            else if (status.type === "pending") classes.push("pending");
            else if (status.type === "past") classes.push("past");
            else classes.push("available");

            if (status.isCheckIn) classes.push("check-in");
            if (status.isCheckOut) classes.push("check-out");
        }

        if (status.isSelectable) {
            classes.push("selectable");

            if (selectedRange.start && !selectedRange.end && hoverDate) {
                if (hoverDate > selectedRange.start) {
                    const isInRange = isWithinInterval(date, {
                        start: selectedRange.start,
                        end: hoverDate,
                    });
                    if (isInRange) classes.push("hover-range");
                }
            }

            if (selectedRange.start && selectedRange.end) {
                const isInRange = isWithinInterval(date, {
                    start: selectedRange.start,
                    end: selectedRange.end,
                });
                if (isInRange) classes.push("in-range");
            }

            if (selectedRange.start && isSameDay(date, selectedRange.start)) {
                classes.push("range-start");
            }

            if (selectedRange.end && isSameDay(date, selectedRange.end)) {
                classes.push("range-end");
            }
        }

        if (!isSameMonth(date, currentDate)) {
            classes.push("outside-month");
        }

        return classes.join(" ");
    }, [getDateStatus, currentDate, selectedRange, hoverDate]);

    // Tarih aralığının geçerli olup olmadığını kontrol et
    const isRangeValid = useCallback((start, end) => {
        if (!start || !end) return true;

        let current = start;
        while (current <= end) {
            const status = getDateStatus(current);
            if (!status.isSelectable) {
                return false;
            }
            current = addDays(current, 1);
        }
        return true;
    }, [getDateStatus]);

    // Tarih tıklama işleyicisi
    const handleDateClick = useCallback((date) => {
        const status = getDateStatus(date);
        if (!status.isSelectable) {
            if (status.type === "no-price") {
                showError("Bu tarih için fiyat bilgisi mevcut değil");
            } else {
                showError("Seçilen tarih müsait değil");
            }
            return;
        }

        if (
            !selectedRange.start ||
            (selectedRange.start && selectedRange.end) ||
            date < selectedRange.start
        ) {
            // İlk tarih seçildi veya yeni bir seçim başlatılıyor
            dispatch(setSelectedDates({
                start: format(date, 'yyyy-MM-dd'),
                end: null
            }));
        } else {
            const minDays = minDaysMap[format(selectedRange.start, "yyyy-MM-dd")];
            const diffInDays = Math.ceil(
                (date - selectedRange.start) / (1000 * 3600 * 24)
            );

            if (diffInDays < minDays) {
                showError(
                    `En az ${minDays} Gece kiralama yapmalısınız. Şu an seçilen tarih aralığı ${diffInDays} Gece.`
                );
                return;
            }

            if (!isRangeValid(selectedRange.start, date)) {
                showError("Seçilen tarih aralığında müsait olmayan günler var");
                return;
            }

            // İkinci tarih seçildi, Redux'a gönder
            dispatch(setSelectedDates({
                start: format(selectedRange.start, 'yyyy-MM-dd'),
                end: format(date, 'yyyy-MM-dd')
            }));

            // Fiyat bilgilerini hesapla
            const priceInfo = calculateAndSetTotalPrice(selectedRange.start, date);

            // Callback ile dışarıya bildir
            onDateSelect?.({
                start: format(selectedRange.start, 'yyyy-MM-dd'),
                end: format(date, 'yyyy-MM-dd'),
                totalPrice: priceInfo?.totalPrice,
                nightPrices: priceInfo?.nightPrices,
                totalNights: priceInfo?.nights
            });
        }
    }, [
        getDateStatus,
        selectedRange,
        minDaysMap,
        isRangeValid,
        showError,
        calculateAndSetTotalPrice,
        dispatch,
        onDateSelect
    ]);

    // Ay içindeki günleri hesapla
    const getDaysInMonth = useCallback((date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const startWeekDay = startOfWeek(start, { locale: tr, weekStartsOn: 1 });

        return eachDayOfInterval({ start: startWeekDay, end });
    }, []);

    // Ayı render et
    const renderMonth = useCallback((date) => {
        const days = getDaysInMonth(date);
        const weekDays = [...Array(7)].map((_, i) =>
            format(
                addDays(startOfWeek(new Date(), { locale: tr, weekStartsOn: 1 }), i),
                'EE',
                { locale: tr }
            )
        );

        return (
            <div className="calendar-month">
                <div className="calendar-header">
                    <h3>{format(date, "MMMM yyyy", { locale: tr })}</h3>
                </div>
                <div className="calendar-weekdays">
                    {weekDays.map((day) => (
                        <div key={day} className="weekday">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar-days">
                    {days.map((day) => {
                        const dateString = format(day, "yyyy-MM-dd");
                        const price = priceMap[dateString];
                        const className = getDateClassName(day);

                        return (
                            <div
                                key={dateString}
                                className={className}
                                onClick={() => handleDateClick(day)}
                                onMouseEnter={() => setHoverDate(day)}
                                onMouseLeave={() => setHoverDate(null)}
                            >
                                <div className="day-content">
                                    <span className="day-number">{format(day, "d")}</span>
                                    {price && (
                                        <span className="day-price">
                                            ₺{Math.floor(price).toLocaleString("tr-TR")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [getDaysInMonth, getDateClassName, priceMap, handleDateClick]);

    // Tarihleri göstermek için bilgi bileşeni
    const renderSelectedDateInfo = useCallback(() => {
        if (!selectedRange.start) {
            return null;
        }

        const formatTurkishDate = (date) => {
            if (!date) return '';
            return format(date, "d MMMM yyyy", { locale: tr });
        };

        return (
            <div className="selected-date-info">
                <span className="font-bold date">
                    {formatTurkishDate(selectedRange.start)}
                    {selectedRange.end ? ` - ${formatTurkishDate(selectedRange.end)}` : ''}
                </span>
                {selectedRange.end && (
                    <span className="nights ml-2">
                        ({differenceInDays(selectedRange.end, selectedRange.start)} Gece)
                    </span>
                )}
            </div>
        );
    }, [selectedRange]);

    return (
        <div className="bottom-availability-calendar">
            <div className="calendar-navigation">
                <button
                    onClick={() => setCurrentDate((prev) => addMonths(prev, -1))}
                    className="nav-button prev"
                >
                    <span>&lt;</span>
                </button>
                <button
                    onClick={() => setCurrentDate((prev) => addMonths(prev, 1))}
                    className="nav-button next"
                >
                    <span>&gt;</span>
                </button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {renderSelectedDateInfo()}
            <div className="calendar-container">
                {renderMonth(currentDate)}
                {renderMonth(nextMonth)}
            </div>
            <div className="calendar-legend">
                <div className="legend-item">
                    <span className="legend-box available"></span>
                    <span>Müsait</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box pending"></span>
                    <span>Opsiyon</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box reserved"></span>
                    <span>Dolu</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box selected"></span>
                    <span>Seçili</span>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
