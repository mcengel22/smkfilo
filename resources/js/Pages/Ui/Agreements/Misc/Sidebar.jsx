import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePolicies } from "@/ServerSide/Hooks/usePolicies";
import { ROUTES } from "@/Libs/Routes/config";

const AgreementsSidebar = () => {
    const { t } = useTranslation();
    const { getPolicies } = usePolicies();
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPolicies();
                setPolicies(data);
            } catch (error) {
                console.error("Politikalar getirilemedi:", error);
            }
        };
        fetchData();
    }, []);

    const routeMap = {
        "gizlilik-sozlesmesi": ROUTES.UI.PRİVACY_AGREEMENTS,
        "iptal-sartlari": ROUTES.UI.CANCELLATİON_CONDİTİONS,
        "kiralama-sozlesmesi": ROUTES.UI.RENTAL_AGREEMENT,
        "kullanim-kosullari": ROUTES.UI.TERMS_OF_USE,
        "kvkk": ROUTES.UI.KVKK,
        "riza-metni": ROUTES.UI.CONSENT_TEXT,
    };

    return (
        <nav className="sidebarb">
            <ul>
                {policies.length > 0 ? (
                    policies.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={routeMap[item.type] || "#"}
                                className={({ isActive }) =>
                                    `sidebar-link${isActive ? " active" : ""}`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400 text-sm px-3 py-2">
                        {t("Henüz politika eklenmemiş.")}
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default AgreementsSidebar;
