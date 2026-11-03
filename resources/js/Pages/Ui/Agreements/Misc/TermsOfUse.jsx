import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AgreementsSidebar from "./Sidebar";
import Header from "../../../../Components/UI/Header/Header";
import { usePolicies } from "@/ServerSide/Hooks/usePolicies";

const TermsOfUse = () => {
    const { t } = useTranslation();
    const { getPolicy } = usePolicies();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔹 Laravel API'den type=kullanim-kosullari olan kayıt çekiliyor
                const data = await getPolicy("kullanim-kosullari");
                setPolicy(data);
            } catch (error) {
                console.error("Kullanım koşulları getirilemedi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex flex-col my-6 px-3 agreement-page">
                <div className="flex flex-wrap">
                    {/* Sol Menü */}
                    <div className="w-full lg:w-1/3 px-3">
                        <AgreementsSidebar />
                    </div>

                    {/* Sağ İçerik */}
                    <div className="w-full lg:w-2/3 px-3">
                        <div className="bg-white rounded-lg p-4 min-h-[300px]">
                            {loading ? (
                                <p className="text-center text-gray-400">{t("Yükleniyor...")}</p>
                            ) : policy ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4 text-center">
                                        {policy.name}
                                    </h2>
                                    <div
                                        className="text-gray-700 leading-relaxed policy-content"
                                        dangerouslySetInnerHTML={{ __html: policy.content }}
                                    />
                                </>
                            ) : (
                                <p className="text-center text-gray-500">
                                    {t("Kullanım koşulları bulunamadı.")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
