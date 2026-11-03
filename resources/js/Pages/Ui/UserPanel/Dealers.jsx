import React, { useState, useEffect } from "react";
import axios from "axios";
import MainDatePicker from "../../../Components/UI/Misc/MainDatePicker";
import Loader from "../../../Components/Loader";

const Dealers = () => {
    const [dealers, setDealers] = useState([]);
    const [filter, setFilter] = useState("");
    const [dateRange, setDateRange] = useState({
        start_date: null,
        end_date: null,
    });
    const STATUS_TR = {
        pending: "Beklemede",
        confirmed: "Onaylandı",
        approved: "Onaylandı",
        cancelled: "İptal",
        canceled: "İptal",
        rejected: "Reddedildi",
        failed: "Başarısız",
    };

    const getStatusLabel = (status) => {
        if (!status) return "-";
        const key = String(status).toLowerCase();
        return STATUS_TR[key] || status;
    };

    const getStatusClass = (status) => {
        const key = String(status || "").toLowerCase();
        if (key === "approved" || key === "confirmed")
            return "bg-green-100 text-green-800";
        if (key === "pending") return "bg-yellow-100 text-yellow-800";
        if (
            key === "cancelled" ||
            key === "canceled" ||
            key === "rejected" ||
            key === "failed"
        )
            return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    const getPaymentPlanStatusLabel = (status) => {
        const labels = {
            pending: "Beklemede",
            paid: "Ödendi",
            overdue: "Gecikmiş",
            cancelled: "İptal",
        };
        return labels[status] || status;
    };

    const getPaymentPlanStatusClass = (status) => {
        const classes = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-green-100 text-green-800",
            overdue: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return classes[status] || "bg-gray-100 text-gray-800";
    };

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsDateRange, setStatsDateRange] = useState({
        start_date: null,
        end_date: null,
    });
    const [isPaymentPlanModalOpen, setIsPaymentPlanModalOpen] = useState(false);
    const [currentPaymentPlanDealer, setCurrentPaymentPlanDealer] =
        useState(null);
    const [paymentPlanFormData, setPaymentPlanFormData] = useState({
        start_date: "",
        end_date: "",
        monthly_amount: "",
        status: "pending",
        note: "",
    });
    const [paymentPlanLoading, setPaymentPlanLoading] = useState(false);
    const [paymentPlanError, setPaymentPlanError] = useState(null);
    const [ibanCopied, setIbanCopied] = useState(false);

    // --- YENİ: Hesap Hareketleri State'leri ---
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyDealer, setHistoryDealer] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    // --- /YENİ ---

    useEffect(() => {
        // Tüm modallar için scroll kilidi
        document.body.style.overflow =
            isModalOpen || isPaymentPlanModalOpen || isHistoryModalOpen
                ? "hidden"
                : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen, isPaymentPlanModalOpen, isHistoryModalOpen]);

    const fetchDealers = () => {
        let params = {};
        if (filter) params.filter = filter;
        if (filter === "custom" && dateRange.start_date && dateRange.end_date) {
            params.start_date = dateRange.start_date;
            params.end_date = dateRange.end_date;
        }
        axios
            .get("/api/v1/dealers", { params })
            .then((response) => setDealers(response.data))
            .catch((error) => console.error("Error fetching dealers:", error));
    };

    useEffect(() => {
        fetchDealers();
    }, [filter, dateRange]);

    const fetchStats = (dealerId, dates) => {
        setStatsLoading(true);
        let params = {};
        if (dates?.start_date && dates?.end_date) {
            params.start_date = dates.start_date;
            params.end_date = dates.end_date;
        }
        axios
            .get(`/api/v1/dealers/${dealerId}/statistics`, { params })
            .then((response) => setStats(response.data))
            .catch((error) => console.error("Error fetching stats:", error))
            .finally(() => setStatsLoading(false));
    };

    const handleImageError = (e, originalPath) => {
        const target = e.currentTarget;
        if (target.src.includes("/img/no-image.jpg")) return;
        const triedRemote = target.dataset.triedRemote === "1";
        if (!triedRemote && originalPath) {
            target.dataset.triedRemote = "1";
            if (/^https?:\/\//i.test(originalPath)) {
                target.src = "/img/no-image.jpg";
                return;
            }
            const cleanPath = originalPath.startsWith("/")
                ? originalPath.slice(1)
                : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            target.src = "/img/no-image.jpg";
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setShowDatePicker(newFilter === "custom");
    };

    const handleDateChange = (newDates) => {
        setDateRange(newDates);
    };

    const handleStatsDateChange = (newDates) => {
        setStatsDateRange(newDates);
        if (selectedDealer && newDates.start_date && newDates.end_date) {
            fetchStats(selectedDealer.id, newDates);
        }
    };

    const openModal = (dealer) => {
        setSelectedDealer(dealer);
        setIsModalOpen(true);
        fetchStats(dealer.id, statsDateRange);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDealer(null);
        setStats(null);
        setStatsDateRange({ start_date: null, end_date: null });
        setIbanCopied(false); // Reset copy status
    };

    const handleIbanCopy = (iban) => {
        if (ibanCopied) return;
        navigator.clipboard
            .writeText(iban)
            .then(() => {
                setIbanCopied(true);
                setTimeout(() => setIbanCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy IBAN: ", err);
            });
    };
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };
    const openPaymentPlanModal = (dealer) => {
        setCurrentPaymentPlanDealer(dealer);

        setPaymentPlanFormData({
            start_date: formatDate(dealer.payment_plan?.start_date),
            end_date: "",
            monthly_amount: "",
            status: "pending",
            note: "",
        });

        setIsPaymentPlanModalOpen(true);
    };

    const closePaymentPlanModal = () => {
        setIsPaymentPlanModalOpen(false);
        setCurrentPaymentPlanDealer(null);
        setPaymentPlanError(null);
        setPaymentPlanFormData({
            start_date: "",
            end_date: "",
            monthly_amount: "",
            status: "pending",
            note: "",
        });
    };

    const handlePaymentPlanFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentPlanFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitPaymentPlan = async (e) => {
        e.preventDefault();
        setPaymentPlanLoading(true);
        setPaymentPlanError(null);
        const planData = {
            ...paymentPlanFormData,
            monthly_amount: Number(paymentPlanFormData.monthly_amount),
        };
        try {
            await axios.post(
                `/api/v1/Kullanici/${currentPaymentPlanDealer.id}/payment-plans`,
                planData,
            );
            closePaymentPlanModal();
            fetchDealers();
        } catch (error) {
            console.error("Error saving payment plan:", error);
            setPaymentPlanError(
                "Ödeme planı kaydedilemedi. Lütfen alanları kontrol edin.",
            );
        } finally {
            setPaymentPlanLoading(false);
        }
    };

    // --- YENİ: Hesap Hareketleri Fonksiyonları ---
    const openHistoryModal = (dealer) => {
        setHistoryDealer(dealer);
        setIsHistoryModalOpen(true);
        setHistoryLoading(true);
        axios
            .get(`/api/v1/dealers/${dealer.id}/payment-plans`)
            .then((response) => {
                setHistoryData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching payment history:", error);
            })
            .finally(() => {
                setHistoryLoading(false);
            });
    };

    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setHistoryDealer(null);
        setHistoryData([]);
    };
    // --- /YENİ ---

    const calculateRemainingDays = (endDateString) => {
        if (!endDateString) return null;
        const endDate = new Date(endDateString);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getRemainingDaysStyle = (remainingDays) => {
        if (remainingDays === null)
            return { width: "0%", className: "bg-gray-200", days: null };
        const days = Math.floor(remainingDays);
        const percentage = Math.min(Math.max((days / 365) * 100, 0), 100);
        let colorClass = "bg-green-500";
        if (days < 30) colorClass = "bg-red-500";
        else if (days < 90) colorClass = "bg-yellow-500";
        return { width: `${percentage}%`, className: colorClass, days };
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-transform hover:scale-105 duration-200">
            <div className={`p-4 rounded-full mr-4 ${color}`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                    {title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Bayi Yönetimi
                            </h1>
                            <p className="text-gray-500">
                                Bayi aboneliklerini ve performanslarını buradan
                                takip edebilirsiniz.
                            </p>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
                            Toplam Bayi: {dealers.length}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "", label: "Tümü" },
                                { id: "this_week", label: "Bu Hafta Bitenler" },
                                { id: "this_month", label: "Bu Ay Bitenler" },
                                { id: "today", label: "Bugün Bitenler" },
                                { id: "custom", label: "Özel Tarih" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleFilterChange(item.id)}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${filter === item.id ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        {showDatePicker && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <MainDatePicker
                                    onChange={handleDateChange}
                                    dates={dateRange}
                                    setActiveDropdown={() => {}}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                        Bayi Adı
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                        Başlangıç
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                        Bitiş
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                        Plan Durumu
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-1/3">
                                        Abonelik Durumu
                                    </th>
                                    <th className="text-right py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dealers.map((dealer) => {
                                    const remainingDays =
                                        calculateRemainingDays(
                                            dealer.payment_plan?.end_date,
                                        );
                                    const { width, className, days } =
                                        getRemainingDaysStyle(remainingDays);
                                    return (
                                        <tr
                                            key={dealer.id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">
                                                    {dealer.name}
                                                </div>
                                                {dealer.iban && (
                                                    <div
                                                        className="text-xs text-gray-500 mt-1 font-mono"
                                                        title="IBAN"
                                                    >
                                                        IBAN: {dealer.iban}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {dealer.payment_plan?.start_date
                                                    ? new Date(
                                                          dealer.payment_plan
                                                              .start_date,
                                                      ).toLocaleDateString(
                                                          "tr-TR",
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {dealer.payment_plan?.end_date
                                                    ? new Date(
                                                          dealer.payment_plan
                                                              .end_date,
                                                      ).toLocaleDateString(
                                                          "tr-TR",
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="py-4 px-6">
                                                {dealer.payment_plan?.status ? (
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentPlanStatusClass(dealer.payment_plan.status)}`}
                                                    >
                                                        {getPaymentPlanStatusLabel(
                                                            dealer.payment_plan
                                                                .status,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                {dealer.payment_plan ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                style={{
                                                                    width,
                                                                }}
                                                                className={`h-full rounded-full ${className} transition-all duration-500`}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${days > 30 ? "bg-green-100 text-green-700" : days > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                                                        >
                                                            {days > 0
                                                                ? `${days} gün`
                                                                : "Süresi Doldu"}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        Plan Yok
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openHistoryModal(
                                                                dealer,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-200"
                                                        title="Hesap Hareketleri"
                                                    >
                                                        📜
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openPaymentPlanModal(
                                                                dealer,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-purple-600 hover:text-white transition-all duration-200"
                                                        title="Ödeme Planı Yönetimi"
                                                    >
                                                        💳
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openModal(dealer)
                                                        }
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                                                        title="Detayları Görüntüle"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Bayi İstatistikleri
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {selectedDealer?.name}
                                    </p>
                                    {selectedDealer?.iban && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <input
                                                type="text"
                                                readOnly
                                                value={selectedDealer.iban}
                                                className="text-sm text-gray-800 font-mono bg-white px-3 py-2 rounded-lg border border-gray-300 w-full max-w-xs shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                onFocus={(e) =>
                                                    e.target.select()
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    handleIbanCopy(
                                                        selectedDealer.iban,
                                                    )
                                                }
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                                                    ibanCopied
                                                        ? "bg-green-500 text-white"
                                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                            >
                                                {ibanCopied ? (
                                                    <span className="flex items-center">
                                                        ✓ Kopyalandı
                                                    </span>
                                                ) : (
                                                    "Kopyala"
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full flex-shrink-0 ml-4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                                <div className="mb-6 bg-blue-50 p-4 sm:p-5 rounded-xl border border-blue-100">
                                    <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-3">
                                        Tarih Aralığı Seçin
                                    </h3>
                                    <MainDatePicker
                                        onChange={handleStatsDateChange}
                                        dates={statsDateRange}
                                        setActiveDropdown={() => {}}
                                    />
                                </div>
                                {statsLoading ? (
                                    <div className="flex flex-col justify-center items-center h-64">
                                        <Loader />
                                        <p className="text-gray-500 mt-4 animate-pulse">
                                            Veriler yükleniyor...
                                        </p>
                                    </div>
                                ) : stats ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                            <StatCard
                                                title="Toplam Rezervasyon"
                                                value={stats.total_reservations}
                                                icon="📝"
                                                color="bg-blue-100 text-blue-600"
                                            />
                                            <StatCard
                                                title="Toplam Ciro"
                                                value={`${Number(stats.total_revenue || 0).toLocaleString("tr-TR")} ₺`}
                                                icon="💰"
                                                color="bg-green-100 text-green-600"
                                            />
                                            <StatCard
                                                title="Bayi Kazancı"
                                                value={`${Number(stats.dealer_earnings || 0).toLocaleString("tr-TR")} ₺`}
                                                icon="💸"
                                                color="bg-purple-100 text-purple-600"
                                            />
                                        </div>
                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    Rezervasyon Detayları
                                                </h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-100">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                İlan
                                                            </th>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Rezervasyon Kodu
                                                            </th>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Müşteri
                                                            </th>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Tarih Aralığı
                                                            </th>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Tutar
                                                            </th>
                                                            <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                                Durum
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {stats.reservations &&
                                                        stats.reservations
                                                            .length > 0 ? (
                                                            stats.reservations.map(
                                                                (res) => (
                                                                    <tr
                                                                        key={
                                                                            res.id
                                                                        }
                                                                        className="hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <td className="py-4 px-6">
                                                                            <div className="flex items-center">
                                                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 mr-3 border border-gray-200">
                                                                                    {res
                                                                                        .post
                                                                                        ?.media
                                                                                        ?.url ? (
                                                                                        <img
                                                                                            className="h-full w-full object-cover"
                                                                                            src={
                                                                                                res
                                                                                                    .post
                                                                                                    .media
                                                                                                    .url
                                                                                                    ? res
                                                                                                          .post
                                                                                                          .media
                                                                                                          .url
                                                                                                    : "/img/no-image.jpg"
                                                                                            }
                                                                                            alt={
                                                                                                res
                                                                                                    .post
                                                                                                    ?.title ||
                                                                                                "Property"
                                                                                            }
                                                                                            loading="lazy"
                                                                                            onError={(
                                                                                                e,
                                                                                            ) =>
                                                                                                handleImageError(
                                                                                                    e,
                                                                                                    res
                                                                                                        .post
                                                                                                        ?.media
                                                                                                        ?.url,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                                                                                            No
                                                                                            Img
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div
                                                                                    className="text-sm font-medium text-gray-900 truncate max-w-[150px]"
                                                                                    title={
                                                                                        res
                                                                                            .post
                                                                                            ?.title
                                                                                    }
                                                                                >
                                                                                    {res
                                                                                        .post
                                                                                        ?.title ||
                                                                                        "-"}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 px-6 text-sm text-gray-600 font-mono">
                                                                            {
                                                                                res.code
                                                                            }
                                                                        </td>
                                                                        <td className="py-4 px-6 text-sm text-gray-900">
                                                                            {res.reservable ? (
                                                                                <div className="flex flex-col">
                                                                                    <span className="font-medium">
                                                                                        {
                                                                                            res
                                                                                                .reservable
                                                                                                .name
                                                                                        }{" "}
                                                                                        {
                                                                                            res
                                                                                                .reservable
                                                                                                .surname
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {
                                                                                            res
                                                                                                .reservable
                                                                                                .email
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </td>
                                                                        <td className="py-4 px-6 text-sm text-gray-600">
                                                                            <div className="flex flex-col">
                                                                                <span>
                                                                                    {new Date(
                                                                                        res.start_date,
                                                                                    ).toLocaleDateString(
                                                                                        "tr-TR",
                                                                                    )}
                                                                                </span>
                                                                                <span className="text-xs text-gray-400">
                                                                                    to
                                                                                </span>
                                                                                <span>
                                                                                    {new Date(
                                                                                        res.end_date,
                                                                                    ).toLocaleDateString(
                                                                                        "tr-TR",
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-4 px-6 text-sm font-bold text-gray-900">
                                                                            {Number(
                                                                                res.price ||
                                                                                    0,
                                                                            ).toLocaleString(
                                                                                "tr-TR",
                                                                            )}{" "}
                                                                            ₺
                                                                        </td>
                                                                        <td className="py-4 px-6">
                                                                            <span
                                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusClass(res.status)}`}
                                                                            >
                                                                                {getStatusLabel(
                                                                                    res.status,
                                                                                )}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan="6"
                                                                    className="py-8 text-center text-gray-500"
                                                                >
                                                                    <div className="flex flex-col items-center justify-center">
                                                                        <svg
                                                                            className="w-12 h-12 text-gray-300 mb-3"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="2"
                                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                                                            />
                                                                        </svg>
                                                                        <p>
                                                                            Bu
                                                                            tarih
                                                                            aralığında
                                                                            rezervasyon
                                                                            bulunamadı.
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500 text-lg">
                                            İstatistikleri görmek için lütfen
                                            yukarıdan bir tarih aralığı seçin.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPaymentPlanModalOpen && (
                <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Ödeme Planı Yönetimi
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {currentPaymentPlanDealer?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={closePaymentPlanModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <form
                                id="payment-plan-form"
                                onSubmit={handleSubmitPaymentPlan}
                                className="p-4 sm:p-6 overflow-y-auto flex-1"
                            >
                                {paymentPlanError && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                        role="alert"
                                    >
                                        <strong className="font-bold">
                                            Hata!
                                        </strong>
                                        <span className="block sm:inline">
                                            {" "}
                                            {paymentPlanError}
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="start_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Başlangıç Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={
                                                paymentPlanFormData.start_date
                                            }
                                            disabled={
                                                !!currentPaymentPlanDealer?.payment_plan
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="end_date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Bitiş Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            id="end_date"
                                            name="end_date"
                                            value={paymentPlanFormData.end_date}
                                            onChange={
                                                handlePaymentPlanFormChange
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="monthly_amount"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Aylık Tutar (₺)
                                        </label>
                                        <input
                                            type="number"
                                            id="monthly_amount"
                                            name="monthly_amount"
                                            value={
                                                paymentPlanFormData.monthly_amount
                                            }
                                            onChange={
                                                handlePaymentPlanFormChange
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="1500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Durum
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={paymentPlanFormData.status}
                                            onChange={
                                                handlePaymentPlanFormChange
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            required
                                        >
                                            <option value="pending">
                                                Beklemede
                                            </option>
                                            <option value="paid">Ödendi</option>
                                            <option value="overdue">
                                                Gecikmiş
                                            </option>
                                            <option value="cancelled">
                                                İptal Edildi
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="note"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Not
                                        </label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            rows="3"
                                            value={paymentPlanFormData.note}
                                            onChange={
                                                handlePaymentPlanFormChange
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Bayi aboneliği hakkında notlar..."
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closePaymentPlanModal}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all shadow-sm"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    form="payment-plan-form"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm disabled:opacity-50"
                                    disabled={paymentPlanLoading}
                                >
                                    {paymentPlanLoading
                                        ? "Kaydediliyor..."
                                        : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- YENİ: Hesap Hareketleri Modalı --- */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="min-h-full flex items-start justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Hesap Hareketleri
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {historyDealer?.name}
                                    </p>
                                </div>
                                <button
                                    onClick={closeHistoryModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                                {historyLoading ? (
                                    <div className="flex justify-center items-center h-48">
                                        <Loader />
                                    </div>
                                ) : historyData.length > 0 ? (
                                    <div className="flow-root">
                                        <ul role="list" className="-mb-8">
                                            {historyData.map(
                                                (item, itemIdx) => (
                                                    <li key={item.id}>
                                                        <div className="relative pb-8">
                                                            {itemIdx !==
                                                            historyData.length -
                                                                1 ? (
                                                                <span
                                                                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : null}
                                                            <div className="relative flex items-start space-x-3">
                                                                <div>
                                                                    <span
                                                                        className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getPaymentPlanStatusClass(item.status)}`}
                                                                    >
                                                                        <svg
                                                                            className="h-6 w-6 text-white"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div>
                                                                        <div className="text-sm">
                                                                            <p className="font-medium text-gray-900">
                                                                                {Number(
                                                                                    item.monthly_amount,
                                                                                ).toLocaleString(
                                                                                    "tr-TR",
                                                                                    {
                                                                                        style: "currency",
                                                                                        currency:
                                                                                            "TRY",
                                                                                    },
                                                                                )}{" "}
                                                                                -{" "}
                                                                                <span
                                                                                    className={`font-bold ${getPaymentPlanStatusClass(item.status).split(" ")[1]}`}
                                                                                >
                                                                                    {getPaymentPlanStatusLabel(
                                                                                        item.status,
                                                                                    )}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                                            Oluşturulma:{" "}
                                                                            {new Date(
                                                                                item.created_at,
                                                                            ).toLocaleString(
                                                                                "tr-TR",
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-2 text-sm text-gray-700">
                                                                        <p>
                                                                            <b>
                                                                                Not:
                                                                            </b>{" "}
                                                                            {item.note ||
                                                                                "-"}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            Geçerlilik:{" "}
                                                                            {new Date(
                                                                                item.start_date,
                                                                            ).toLocaleDateString(
                                                                                "tr-TR",
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {new Date(
                                                                                item.end_date,
                                                                            ).toLocaleDateString(
                                                                                "tr-TR",
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">
                                            Bu bayi için hiç hesap hareketi
                                            bulunamadı.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={closeHistoryModal}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dealers;
