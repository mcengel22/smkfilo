import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

const MainDatePicker = ({
    onChange,
    setActiveDropdown,
    dates = { start_date: null, end_date: null },
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        dates.start_date ? new Date(dates.start_date) : null,
        dates.end_date ? new Date(dates.end_date) : null,
    ]);

    const [startDate, endDate] = dateRange;
    const wrapperRef = useRef(null);

    useEffect(() => {
        setDateRange([
            dates.start_date ? new Date(dates.start_date) : null,
            dates.end_date ? new Date(dates.end_date) : null,
        ]);
    }, [dates.start_date, dates.end_date]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ** Tarih değiştiğinde HomeTabs'a bildir! **
    const handleDateChange = (update) => {
        setDateRange(update);
        if (update[0] && update[1]) {
            setIsOpen(false);

            // **HomeTabs'a tarihleri bildiriyoruz**
            onChange({
                start_date: format(update[0], "yyyy-MM-dd"),
                end_date: format(update[1], "yyyy-MM-dd"),
            });
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="datepicker-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div className="search-datepicker" ref={wrapperRef}>
                <div
                    className="search-datepicker-header"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="search-dates-wrapper">
                        <div className="search-date-section">
                            <div className="search-date-content">
                                <span className="search-date-label me-2">
                                    Giriş
                                </span>
                                <span className="search-date-value">
                                    {startDate
                                        ? format(startDate, "d MMMM yyyy", {
                                              locale: tr,
                                          })
                                        : ""}
                                </span>
                            </div>
                        </div>
                        <div className="search-date-divider"></div>
                        <div className="search-date-section">
                            <div className="search-date-content">
                                <span className="search-date-label me-2">
                                    Çıkış
                                </span>
                                <span className="search-date-value">
                                    {endDate
                                        ? format(endDate, "d MMMM yyyy", {
                                              locale: tr,
                                          })
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="search-datepicker-dropdown">
                        <DatePicker
                            onClick={() => setActiveDropdown("date")}
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                            locale={tr}
                            monthsShown={1}
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 365)}
                            dateFormat="dd/MM/yyyy"
                            calendarClassName="search-calendar"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default MainDatePicker;
