import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Bayi istatistikleri için state'ler
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState(null);
    const [dealerStats, setDealerStats] = useState(null);
    const [dealerLoading, setDealerLoading] = useState(false);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem("authToken");

            const res = await axios.get("/api/v1/reports/statistics", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDealers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get("/api/v1/dealers", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDealers(res.data);
        } catch (error) {
            console.error("Bayiler yüklenirken hata oluştu:", error);
        }
    };

    const fetchDealerStats = async (dealerId) => {
        setDealerLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`/api/v1/dealers/${dealerId}/statistics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDealerStats(res.data);
        } catch (error) {
            console.error("Bayi istatistikleri yüklenirken hata oluştu:", error);
        } finally {
            setDealerLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        fetchDealers();
    }, []);

    const handleDealerChange = (e) => {
        const dealerId = e.target.value;
        setSelectedDealer(dealerId);
        if (dealerId) {
            fetchDealerStats(dealerId);
        } else {
            setDealerStats(null);
        }
    };

    if (loading) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    if (!stats) {
        return <div className="text-danger p-6">Veri bulunamadı</div>;
    }

    // Ay isimleri
    const monthNames = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

    // Grafikte kullanılacak veriler
    const chartCategories = stats.monthly.map((m) => monthNames[m.month - 1]);
    const chartReservations = stats.monthly.map((m) => m.count);
    const chartEarnings = stats.monthly.map((m) => m.earnings);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-8">📊 Raporlar</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <KpiCard
                    title="Toplam Rezervasyon"
                    value={stats.total_reservations}
                    icon="📦"
                    color="bg-blue-500"
                />

                <KpiCard
                    title="Toplam Kazanç"
                    value={stats.total_earnings + ' ₺'}
                    icon="💰"
                    color="bg-green-500"
                />

                <KpiCard
                    title="Toplam Kullanıcı"
                    value={stats.total_users}
                    icon="👥"
                    color="bg-purple-500"
                />

                <KpiCard
                    title="Ev Sahibi Sayısı"
                    value={stats.total_companies}
                    icon="🏠"
                    color="bg-orange-500"
                />

                <KpiCard
                    title="Bugünkü Rezervasyonlar"
                    value={stats.today_reservations}
                    icon="📅"
                    color="bg-indigo-500"
                />

                <KpiCard
                    title="Bugünkü Kazanç"
                    value={stats.today_earnings + ' ₺'}
                    icon="⚡"
                    color="bg-red-500"
                />
            </div>

            {/* Grafik Alanı */}
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4">📈 Aylık Rezervasyon & Kazanç</h2>

                <Chart
                    type="line"
                    height={350}
                    series={[
                        {
                            name: "Rezervasyon",
                            data: chartReservations
                        },
                        {
                            name: "Kazanç (₺)",
                            data: chartEarnings
                        }
                    ]}
                    options={{
                        chart: { toolbar: { show: false } },
                        stroke: { curve: "smooth", width: 3 },
                        xaxis: { categories: chartCategories },
                        yaxis: { labels: { style: { fontSize: "14px" } } },
                        legend: { position: "top" },
                        markers: { size: 5 },
                        colors: ["#2563eb", "#16a34a"]
                    }}
                />
            </div>

            {/* Bayi İstatistikleri Alanı */}
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-xl font-bold mb-4">🏢 Bayi Raporları</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bayi Seçiniz</label>
                    <select
                        className="block w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={handleDealerChange}
                        value={selectedDealer || ""}
                    >
                        <option value="">Seçiniz...</option>
                        {dealers.map(dealer => (
                            <option key={dealer.id} value={dealer.id}>
                                {dealer.name} {dealer.surname} ({dealer.dealer_code})
                            </option>
                        ))}
                    </select>
                </div>

                {dealerLoading && <div className="text-gray-500">Bayi verileri yükleniyor...</div>}

                {dealerStats && !dealerLoading && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-600 font-medium">Toplam Rezervasyon</p>
                                <p className="text-2xl font-bold text-blue-800">{dealerStats.total_reservations}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-sm text-green-600 font-medium">Toplam Ciro</p>
                                <p className="text-2xl font-bold text-green-800">{dealerStats.total_revenue} ₺</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-sm text-purple-600 font-medium">Bayi Kazancı</p>
                                <p className="text-2xl font-bold text-purple-800">{dealerStats.dealer_earnings.toFixed(2)} ₺</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-3">Rezervasyon Geçmişi</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kazanç</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dealerStats.reservations.length > 0 ? (
                                        dealerStats.reservations.map((res) => (
                                            <tr key={res.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {res.post?.title || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {res.reservable ? `${res.reservable.name} ${res.reservable.surname}` : "Manuel Rezervasyon"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(res.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                    {res.price} ₺
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-bold">
                                                    {res.calculated_earnings.toFixed(2)} ₺
                                                    <span className="block text-xs text-gray-400 font-normal">{res.calculation_type}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${res.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                          res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                          'bg-red-100 text-red-800'}`}>
                                                        {res.status === 'confirmed' ? 'Onaylandı' :
                                                         res.status === 'pending' ? 'Bekliyor' : 'İptal'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Bu bayi için henüz rezervasyon bulunmuyor.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};


/* --- KPI COMPONENT --- */
const KpiCard = ({ title, value, icon, color }) => {
    return (
        <div className="p-5 bg-white rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition-all">
            <div className={`w-14 h-14 text-3xl flex items-center justify-center text-white rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </div>
    );
};

export default Reports;
