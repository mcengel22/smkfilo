import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CustomModal from "./CustomModal";
import ManualForm from "./ManualReservation";
import ExternalForm from "./ExternalReservation";
import { useTranslation } from "react-i18next";
import { parseISO } from "date-fns";
import { useReservation } from "../../../../../../ServerSide/Hooks/useReservation";
import { toast } from "react-toastify";

const ReservationCalendar = ({ data = [], selectedPost }) => {
    const { t } = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [events, setEvents] = useState([]);
    const [step, setStep] = useState("selectType");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isRangeModeActive, setIsRangeModeActive] = useState(false);
    const [rangeStartDate, setRangeStartDate] = useState(null);
    const calendarRef = useRef(null);
    const { createManualReservation, createExternalReservation } = useReservation(); // 👈 Güncel hali

    // Gelen veriyi takvim olaylarına dönüştürme
    useEffect(() => {
        if (data && data.length > 0) {
            const formattedEvents = data.map((reservation) => {
                // Durum rengini belirleme
                let backgroundColor = "#0081c9"; // default

                if (reservation.type === "otomatik") {
                    // Otomatik ise state'e göre renk
                    switch (reservation.state) {
                        case "waiting":
                            backgroundColor = "#FFA500"; // Turuncu
                            break;
                        case "finished":
                            backgroundColor = "#28a745"; // Yeşil
                            break;
                        default:
                            backgroundColor = "#0081c9"; // Varsayılan mavi
                    }
                } else if (reservation.type === "manual") {
                    backgroundColor = "#0081c9"; // Mavi
                } else if (reservation.type === "external") {
                    backgroundColor = "#6c757d"; // Gri
                }

                // Rezervasyon durumuna göre title
                const statusText = reservation.status === "confirmed" ? t("Onaylandı") : t("Beklemede");

                // ✅ Bitiş tarihini dahil etme (örneğin 31'i boş göstermek için)
                const endDate = parseISO(reservation.endDate);
                const adjustedEndDate = new Date(endDate); // 🔥 Artık +1 yok

                return {
                    id: reservation.id.toString(),
                    title: `${reservation.code} - ${reservation.customer} (${statusText})`,
                    start: parseISO(reservation.startDate),
                    end: adjustedEndDate, // ✅ 31 artık boş (müsait)
                    allDay: true,
                    backgroundColor,
                    borderColor: "transparent",
                    textColor: "#fff",
                    extendedProps: {
                        code: reservation.code,
                        price: reservation.price,
                        state: reservation.state,
                        status: reservation.status,
                        customer: reservation.customer,
                        imageUrl: reservation.image?.media_url || "",
                        slug: reservation.slug,
                    },
                };
            });

            setEvents(formattedEvents);
        } else {
            setEvents([]);
        }
    }, [data, t]);

    // Tarih aralık seçicisi
    const handleDateClick = (info) => {
        if (!isRangeModeActive) {
            // Başlangıç tarihi
            setRangeStartDate(new Date(info.date));
            setIsRangeModeActive(true);
        } else {
            // Bitiş tarihi (checkout mantığı: end hariç)
            const endDate = new Date(info.date);
            let start = new Date(rangeStartDate);
            let end = endDate;

            // Başlangıç tarihi, bitiş tarihinden sonraysa yerlerini değiştir
            if (start > end) {
                [start, end] = [end, start];
            }

            // Seçilen tarih aralığını oluştur (✅ end hariç)
            const dates = [];
            const current = new Date(start);
            while (current < end) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }

            setSelectedDates(dates);
            highlightSelection(dates);
            setModalIsOpen(true);
            setStep("selectType");
            setIsRangeModeActive(false);
        }
    };

    // Normal sürükleme seçimi işlemi
    const handleDateSelect = (info) => {
        const dates = [];
        const start = new Date(info.start);
        const end = new Date(info.end); // ✅ FullCalendar zaten exclusive verir

        const current = new Date(start);
        while (current < end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        setSelectedDates(dates);
        highlightSelection(dates);
        setStep("selectType");

        // En az 2 gün seçilmişse modal'ı aç
        if (dates.length >= 2) {
            setModalIsOpen(true);
        }
    };

    const formatDate = (date) =>
        date ? date.toLocaleDateString("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit" }) : "";

    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const getStartAndEndDates = (dates) => {
        if (!dates.length) return { startDate: null, endDate: null };

        const format = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`; // ✅ YYYY-MM-DD (Laravel uyumlu)
        };

        // ✅ selectedDates "dolu günler" dizisi (end hariç)
        // checkout = son gün + 1
        return {
            startDate: format(dates[0]),
            endDate: format(addDays(dates[dates.length - 1], 1)),
        };
    };

    const isPastDate = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateStr);
        return date < today;
    };

    const validateGuestInfo = (guest = {}) => {
        const required = ["name", "surname", "email", "phone"];
        return required.every((key) => guest[key]?.trim());
    };

    const startOfDay = (d) => {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
    };

    // 🔹 Seçilen tarih aralığı mevcut rezervasyonlarla çakışıyor mu kontrol et
    // ✅ Checkout aynı gün başka rezervasyonun checkin'i olabilir (end == other.start serbest)
    const validateDateRangeConflict = (startDate, endDate) => {
        const start = startOfDay(new Date(startDate)); // inclusive
        const end = startOfDay(new Date(endDate)); // ✅ exclusive (checkout)

        // Tüm mevcut event'leri dolaş
        for (const event of events) {
            if (event.id === "selected-range") continue; // geçici seçim olayını atla

            const existingStart = startOfDay(new Date(event.start));
            const existingEnd = startOfDay(new Date(event.end)); // event.end'i exclusive varsayıyoruz

            // Half-open overlap: [start, end) & [existingStart, existingEnd)
            if (start < existingEnd && end > existingStart) {
                return true; // çakışma var ❌
            }
        }
        return false; // çakışma yok ✅
    };

    const handleSave = async (formData) => {
        try {
            const { startDate, endDate } = getStartAndEndDates(selectedDates);
            const postSlug = selectedPost?.slug;

            if (!postSlug) return toast.error("İlan seçilmeden kayıt yapılamaz!");
            if (!validateGuestInfo(formData)) return toast.error("Misafir bilgileri eksik! 😢");
            if (isPastDate(startDate) || isPastDate(endDate)) return toast.error("⛔ Geçmiş tarihe rezervasyon yapılamaz!");

            // ✅ Tarih çakışması kontrolü
            if (validateDateRangeConflict(startDate, endDate)) {
                return toast.error("❌ Bu tarihlerde başka bir rezervasyon var!");
            }

            const payload = {
                postSlug,
                price: parseFloat(formData.total_price || 0),
                start_date: startDate,
                end_date: endDate,
                payment_method: formData.type,
                reservation_details: {
                    adults: parseInt(formData.adult_count || 0),
                    children: parseInt(formData.child_count || 0),
                    infants: parseInt(formData.infant_count || 0),
                    cleaning_fee: 0,
                    deposit: parseFloat(formData.damage_deposit || 0),
                    note: formData.note || "",
                },
                guest: {
                    first_name: formData.name.trim(),
                    last_name: formData.surname.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                },
            };

            const result = await createManualReservation(payload);

            if (result?.data) {
                setModalIsOpen(false);
                const res = result.data;

                // Geçici seçim kaldır
                setEvents((prev) => prev.filter((e) => e.id !== "selected-range"));

                const endForCalendar = new Date(res.endDate);
                endForCalendar.setDate(endForCalendar.getDate() + 1); // 🔥 1 gün ekle

                setEvents((prev) => [
                    ...prev,
                    {
                        id: res.id,
                        title: `Manuel - ${res.code} - ${res.customer || "Yeni Müşteri"}`,
                        start: startDate,
                        end: endForCalendar,
                        allDay: true,
                        backgroundColor: "#0081c9",
                        borderColor: "transparent",
                        textColor: "#fff",
                        extendedProps: {
                            code: res.code,
                            customer: res.customer,
                            state: res.state,
                            status: res.status,
                            price: res.price,
                        },
                    },
                ]);

                setModalIsOpen(false);
                setSelectedDates([]);
                setStep("selectType");
            }
        } catch (error) {
            console.error("❌ Kayıt hatası:", error);
            toast.error("😢 Rezervasyon sırasında hata oluştu.");
        }
    };

    const handleExternalSave = async (formData) => {
        try {
            const { startDate, endDate } = getStartAndEndDates(selectedDates);
            const postSlug = selectedPost?.slug;

            if (!postSlug) return toast.error("İlan seçilmeden kayıt yapılamaz!");
            if (isPastDate(startDate) || isPastDate(endDate)) return toast.error("⛔ Geçmiş tarihe rezervasyon yapılamaz!");

            // ✅ Tarih çakışması kontrolü
            if (validateDateRangeConflict(startDate, endDate)) {
                return toast.error("❌ Bu tarihlerde başka bir rezervasyon var!");
            }

            const payload = {
                postSlug,
                start_date: startDate,
                end_date: endDate,
                note: formData.note || "",
                admin_note: formData.admin_note || "",
                type: "external", // ✅ EKLENDİ
            };

            const result = await createExternalReservation(payload);

            if (result?.reservation) {
                setModalIsOpen(false);
                setEvents((prev) => prev.filter((e) => e.id !== "selected-range"));

                const res = result.reservation;
                const endForCalendar = new Date(res.end_date);
                endForCalendar.setDate(endForCalendar.getDate() + 1);

                setEvents((prev) => [
                    ...prev,
                    {
                        id: res.id,
                        title: `Harici Rez. - ${res.code}`,
                        start: res.start_date,
                        end: endForCalendar,
                        allDay: true,
                        backgroundColor: "#6c757d", // gri
                        borderColor: "transparent",
                        textColor: "#fff",
                        extendedProps: {
                            code: res.code,
                            customer: "Harici",
                            state: res.state,
                            status: res.status,
                            price: res.price,
                            type: "external", // ✅ frontend’de de kaybolmasın
                        },
                    },
                ]);

                setModalIsOpen(false);
                setSelectedDates([]);
                setStep("selectType");
            }
        } catch (error) {
            console.error("❌ Harici kayıt hatası:", error);
            toast.error("😢 Harici rezervasyon sırasında hata oluştu.");
        }
    };

    // Olay tıklaması için işleyici
    const handleEventClick = (info) => {
        const event = info.event;
        const props = event.extendedProps;

        // Tarihleri ayarla
        const displayEndDate = new Date(event.end);
        displayEndDate.setDate(displayEndDate.getDate() - 1);

        setSelectedEvent({
            code: props?.code || "-",
            customer: props?.customer || "-",
            price: props?.price || "-",
            state: props?.state || "-",
            start: formatDate(event.start),
            end: formatDate(displayEndDate),
        });

        setDetailModalOpen(true);
    };

    // Aralık seçimini iptal et
    const handleCancelRangeSelection = () => {
        setEvents((prev) => prev.filter((event) => event.id !== "selected-range"));
        setIsRangeModeActive(false);
    };

    // FullCalendar etkinlik render fonksiyonu (özel bir render için)
    const renderEventContent = (eventInfo) => {
        return (
            <>
                <div className="fc-event-title">{eventInfo.event.title}</div>
            </>
        );
    };

    const highlightSelection = (dates) => {
        if (!dates.length) return;

        const start = dates[0];
        const end = dates[dates.length - 1];

        const selectionEvent = {
            id: "selected-range",
            title: "", // Görselde yazı istemiyorsan boş bırak
            start,
            end: new Date(new Date(end).setDate(end.getDate() + 1)), // FC end exclusive
            allDay: true,
            backgroundColor: "#3b82f6", // 🔵 mavi (Tailwind blue-600)
            borderColor: "transparent",
            textColor: "transparent", // yazı görünmesin
            display: "background", // 🔥 sadece arka plan
        };

        // Seçimi güncelle
        setEvents((prev) => [...prev.filter((event) => event.id !== "selected-range"), selectionEvent]);
    };

    const highlightSuccessRange = (dates, code = "Rezervasyon") => {
        if (!dates.length) return;

        const start = dates[0];
        const end = dates[dates.length - 1];

        const successEvent = {
            id: `success-${Date.now()}`, // her biri farklı id ile eklensin
            title: code, // küçük bir etiket gösterilebilir
            start,
            end: new Date(new Date(end).setDate(end.getDate() + 1)), // FC end exclusive
            allDay: true,
            backgroundColor: "#22c55e", // ✅ yeşil (Tailwind green-500)
            borderColor: "transparent",
            textColor: "#fff",
            display: "background",
        };

        setEvents((prev) => [...prev, successEvent]);
    };

    return (
        <div className="reservation-calendar-container">
            {/* Aralık seçim bilgisi */}
            {isRangeModeActive && (
                <div className="range-selection-status">
                    <p>
                        {t("Başlangıç tarihi seçildi")}: {formatDate(rangeStartDate)}
                    </p>
                    <p>{t("Şimdi bitiş tarihini seçin")}</p>
                    <button className="cancel-range-btn" onClick={handleCancelRangeSelection}>
                        {t("İptal")}
                    </button>
                </div>
            )}

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                select={handleDateSelect}
                dateClick={handleDateClick}
                events={events}
                locale="tr"
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth",
                }}
                height="auto"
                fixedWeekCount={false}
                dayMaxEventRows={1} // Sadece 1 etkinlik göster
                moreLinkClick="popover"
                eventDisplay="block"
                displayEventEnd={false}
                dayMaxEvents={false} // Tüm günü kaplasın, popup göster
                eventTimeFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: false,
                }}
            />

            <CustomModal
                isOpen={detailModalOpen}
                onClose={() => {
                    setDetailModalOpen(false);
                    handleCancelRangeSelection();
                }}
            >
                {selectedEvent && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-center">📋 {t("Rezervasyon Detayı")}</h3>
                        <p>
                            <strong>{t("Kod")}:</strong> {selectedEvent.code}
                        </p>
                        <p>
                            <strong>{t("Müşteri")}:</strong> {selectedEvent.customer}
                        </p>
                        <p>
                            <strong>{t("Fiyat")}:</strong> {selectedEvent.price}
                        </p>
                        <p>
                            <strong>{t("Durum")}:</strong> {selectedEvent.state}
                        </p>
                        <p>
                            <strong>{t("Başlangıç")}:</strong> {selectedEvent.start}
                        </p>
                        <p>
                            <strong>{t("Bitiş")}:</strong> {selectedEvent.end}
                        </p>
                    </div>
                )}
            </CustomModal>

            <CustomModal
                isOpen={modalIsOpen}
                onClose={() => {
                    setModalIsOpen(false);
                    handleCancelRangeSelection();
                }}
            >
                {step === "selectType" && (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">{t("Rezervasyon Tipi Seçin")}</h3>
                        <p className="text-sm font-semibold">
                            {formatDate(selectedDates[0])} - {formatDate(selectedDates[selectedDates.length - 1])}
                        </p>
                        <div className="flex justify-center gap-3 mt-4">
                            <button onClick={() => setStep("manual")} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold">
                                {t("Manuel Rezervasyon")}
                            </button>
                            <button onClick={() => setStep("external")} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold">
                                {t("Harici Rezervasyon")}
                            </button>
                        </div>
                    </div>
                )}

                {step === "manual" && <ManualForm onSave={handleSave} onBack={() => setStep("selectType")} />}

                {step === "external" && (
                    <ExternalForm
                        selectedDates={getStartAndEndDates(selectedDates)}
                        onSave={handleExternalSave}
                        onClose={() => setModalIsOpen(false)} // 🔥 EKLENDİ
                    />
                )}
            </CustomModal>
        </div>
    );
};

export default ReservationCalendar;
