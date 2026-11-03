import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AgreementsSidebar from "./Sidebar";
import Header from "../../../../Components/UI/Header/Header";
import { usePolicies } from "@/ServerSide/Hooks/usePolicies";

const PrivacyAgreement = () => {
    const { t } = useTranslation();
    const { getPolicy } = usePolicies();
    const [policy, setPolicy] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPolicy("gizlilik-sozlesmesi"); // <-- type ile çağırıyoruz
                setPolicy(data);
            } catch (error) {
                console.error("Politika getirilemedi:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex flex-col my-6 px-3 agreement-page">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/3 px-3">
                        <AgreementsSidebar />
                    </div>

                    <div className="w-full lg:w-2/3 px-3">
                        <div className="bg-white rounded-lg p-4">
                            {policy ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4 text-center">
                                        {policy.name}
                                    </h2>
                                    <div
                                        className="text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: policy.content }}
                                    />
                                </>
                            ) : (
                                <p className="text-center text-gray-400">{t("Yükleniyor...")}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyAgreement;
