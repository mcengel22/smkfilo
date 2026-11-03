import React, { useState, useEffect } from "react";
import ReservationCalendar from "./Misc/Calendar";
import { useTranslation } from "react-i18next";
import Select from "react-dropdown-select";
import { useSearch } from "../../../../../ServerSide/Hooks/useSearch";
import { useReservation } from "../../../../../ServerSide/Hooks/useReservation";
import { useDebounce } from "react-use";
import { useSelector } from "react-redux";

// 🔥 Türkçe karakter normalize fonksiyonu
const normalize = (str) => {
    if (!str) return "";
    const map = {
        'Ç': 'c', 'ç': 'c',
        'Ğ': 'g', 'ğ': 'g',
        'İ': 'i', 'I': 'i', 'ı': 'i', 'i': 'i',
        'Ö': 'o', 'ö': 'o',
        'Ş': 's', 'ş': 's',
        'Ü': 'u', 'ü': 'u'
    };

    return str
        .split('')
        .map(ch => map[ch] || ch)
        .join('')
        .toLowerCase();
};

const ReservationCreate = () => {
    const { t } = useTranslation();
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState("");

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const reservationLoading = useSelector((state) => state.reservation.loading);

    const { select2Search } = useSearch();
    const { getReservationsByPostRoot } = useReservation();

    // Input debounce
    useDebounce(() => {
        setDebouncedQuery(query);
    }, 300, [query]);

    // 🔎 Arama işlevi (normalize edilmiş)
    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setOptions([]);
            return;
        }

        setLoading(true);

        select2Search(debouncedQuery)
            .then((results) => {
                if (Array.isArray(results)) {
                    const formatted = results
                        .filter((item) =>
                            normalize(item.text).includes(normalize(query))
                        )
                        .map((item) => ({
                            value: item.id,
                            label: item.text,
                            slug: item.slug
                        }));

                    setOptions(formatted);
                } else {
                    setOptions([]);
                }
            })
            .catch(() => setOptions([]))
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    // 📌 İlan seçildiğinde çalışır
    const handleChange = async (selected) => {
        if (selected.length > 0) {
            setSelectedPost(selected[0]);
            setIsCalendarVisible(true);

            try {
                const response = await getReservationsByPostRoot(selected[0].slug);

                if (response?.data) {
                    setData(
                        Array.isArray(response.data)
                            ? response.data
                            : response.data.data || []
                    );
                } else {
                    setData([]);
                }
            } catch (error) {
                setData([]);
            }
        }
    };

    return (
        <div>
            {/* Başlık */}
            <div className="title">
                <h1>{t("Rezervasyonlar")}</h1>
                <span className="sub-title">
                    {t("İlan seçip rezervasyon oluşturabilirsiniz")}
                </span>
            </div>

            {/* Arama Alanı */}
            <div className="bg-white p-4 rounded-md mb-4">
                <form>
                    <div className="gap-2 md:grid-cols-12 mb-3">
                        <div className="form-group">
                            <label
                                htmlFor="advert_category"
                                className="block text-sm font-semibold mb-1"
                            >
                                {t("İlan Kategorisi Seçiniz")}{" "}
                                <span className="required">*</span>
                            </label>

                            <Select
                                options={options}
                                labelField="label"
                                valueField="value"
                                className="searchTerm"
                                searchable={true}
                                searchFn={({ state }) => {
                                    setQuery(state.search);
                                    return options;
                                }}
                                loading={loading}
                                noDataLabel="Sonuç bulunamadı"
                                onChange={handleChange}
                                clearOnSelect={true}
                                placeholder={t("İlan ara...")}
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Takvim */}
            {isCalendarVisible && !reservationLoading && (
                <div className="card">
                    <div className="advert-name">
                        <p className="text-sm">
                            <strong>{t("İlan Adı")}:</strong> {selectedPost?.label}
                        </p>
                    </div>

                    <ReservationCalendar data={data} selectedPost={selectedPost} />
                </div>
            )}
        </div>
    );
};

export default ReservationCreate;
