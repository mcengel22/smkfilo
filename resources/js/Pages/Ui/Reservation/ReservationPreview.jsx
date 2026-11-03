import React, { useState } from "react";

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const translateStatus = (status) => {
    switch (status) {
        case "confirmed": return "Onaylandı";
        case "pending": return "Beklemede";
        case "cancelled": return "İptal Edildi";
        default: return status;
    }
};

const translateState = (state) => {
    switch (state) {
        case "finished": return "Tamamlandı";
        case "processing": return "İşleniyor";
        case "waiting": return "Bekliyor";
        default: return state;
    }
};

const ReservationPreview = ({ data }) => {
    const [copied, setCopied] = useState(false);
    if (!data) return null;

    const {
        code, customer, post,
        dateRange, deposit, cleaningFee,
        totalPrice, status, state,
    } = data;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9] p-6 md:p-10">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-8 border border-blue-100">

                {/* Başlık + Kod */}
                <div className="border-b pb-6 mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-sky-700 flex items-center gap-2">
                        🧾 Rezervasyon Bilgileriniz
                    </h1>

                    <label className="mt-4 block text-sm font-medium text-gray-700">Rezervasyon Kodu:</label>
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={code}
                            className="w-full sm:max-w-xs bg-sky-50 text-sky-700 font-mono text-sm px-3 py-2 rounded-md border border-sky-200"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                            {copied ? "✔️ Kopyalandı" : "Kopyala"}
                        </button>
                    </div>
                </div>

                {/* Bilgi Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Kullanıcı Bilgileri */}
                    <section className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
                        <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-2 mb-4">
                            👤 Kullanıcı Bilgileri
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-800">
                            <li><strong>Ad Soyad:</strong> {customer.name}</li>
                            <li><strong>Telefon:</strong> {customer.phone}</li>
                        </ul>
                    </section>

                    {/* İlan Bilgileri */}
                    <section className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
                        <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-2 mb-4">
                            🏡 İlan Bilgileri
                        </h2>
                        <img
                            src={post.media?.url}
                            alt="İlan"
                            className="rounded-xl w-full h-40 object-cover mb-4 border border-sky-100"
                        />
                        <ul className="space-y-2 text-sm text-gray-800">
                            <li><strong>İlan Adı:</strong> {post.title}</li>
                            <li><strong>Adres:</strong> {post.region}</li>
                            <li><strong>Temizlik Ücreti:</strong> {cleaningFee} ₺</li>
                            <li><strong>Toplam Ücret:</strong> {totalPrice} ₺</li>
                        </ul>
                    </section>
                </div>

                {/* Diğer Bilgiler */}
                <section className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm mt-10">
                    <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-2 mb-4">
                        📆 Diğer Bilgiler
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800">
                        <ul className="space-y-2">
                            <li><strong>Giriş Tarihi:</strong> {formatDate(dateRange.start)}</li>
                            <li><strong>Çıkış Tarihi:</strong> {formatDate(dateRange.end)}</li>
                            <li><strong>Depozito:</strong> {deposit} ₺</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>
                                <strong>Durum:</strong>{" "}
                                <span className="inline-block bg-sky-50 text-sky-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {translateStatus(status)}
                </span>
                            </li>
                            <li>
                                <strong>Aşama:</strong>{" "}
                                <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {translateState(state)}
                </span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReservationPreview;
