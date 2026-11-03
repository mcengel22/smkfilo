import React, { useEffect } from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from 'react-i18next';
import { useCampaign } from "../../../ServerSide/Hooks/useCampaign";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CampaignListing = () => {
    const { t } = useTranslation();
    const { setCampaigns } = useCampaign();
    const campaigns = useSelector(state => state.home.campaign.campaigns);

    useEffect(() => {
        const setCampaign = async () => {
            try {
                await setCampaigns();
            } catch (err) {
                console.error("Kampanyalar yüklenirken hata:", err);
            }
        };

        setCampaign();
    }, []);

    // 📋 Kupon kopyalama fonksiyonu
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6 text-center">
                    <h3 className="text-3xl font-extrabold text-orange-600 drop-shadow-sm">
                        {t('🎉 Kampanyalar Listesi')}
                    </h3>
                    <p className="text-sm text-gray-500">{t('Kaçırılmayacak fırsatlarla dolu kampanyalar seni bekliyor!')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(campaigns) && campaigns.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
                        >
                            {/* 📸 Görsel */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image?.media_url || "/img/default.jpg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    {item.coupon?.code || "KAMPANYA"}
                                </span>
                            </div>

                            {/* 📝 İçerik */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                                <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                                <p className="text-xs text-gray-500 mb-4">{item.long_content}</p>

                                {/* 🎁 Kupon Detayları + Kopyalama */}
                                <div className="bg-orange-50 text-orange-900 text-sm p-3 rounded-md shadow-inner mb-4 flex justify-between items-start gap-2">
                                    <div>
                                        <p><strong>{t('🎁 Kupon Kodu')}:</strong> {item.coupon?.code || "-"}</p>
                                        <p>
                                            <strong>{t('💰 İndirim')}:</strong>{" "}
                                            {item.coupon?.discount_value
                                                ? item.coupon.type === "percentage"
                                                    ? `${item.coupon.discount_value}%`
                                                    : `₺${parseFloat(item.coupon.discount_value).toLocaleString("tr-TR")}`
                                                : "-"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(item.coupon?.code || "")}
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-2 rounded shadow mt-1"
                                    >
                                        📋 {t('Kopyala')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 🚫 Hiç kampanya yoksa */}
                    {Array.isArray(campaigns) && campaigns.length === 0 && (
                        <div className="col-span-12 text-center text-gray-500">
                            {t("Herhangi bir kampanya bulunamadı.")}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CampaignListing;
