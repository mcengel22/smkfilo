import React, { Suspense } from "react";
import Loader from "../../../Components/Loader";
import TopHeader from "./Misc/TopHeader";
import { Link, Outlet } from "react-router-dom";
import Footer from "./Misc/Footer";
import Header from "../../../Components/UI/Header/Header";
import Aside from "../../../Pages/Ui/UserPanel/Aside";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../Libs/Routes/config";
import { useSelector } from "react-redux";

const PanelLayout = () => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user);

    // Kullanıcı tipine göre yetki kontrolü
    const hasPermission = (requiredType) => {
        if (!user) return false;

        switch (requiredType) {
            case "super_admin":
                return user.type === "super_admin";
            case "admin_or_higher":
                return ["admin", "super_admin"].includes(user.type);
            case "any_user":
                return ["user", "admin", "super_admin"].includes(user.type);
            default:
                return false;
        }
    };

    return (
        <div>
            <TopHeader />
            <Header />
            <div className="inner-page panel superadmin">
                <div className="max-w-9xl mx-auto sm:px-2 md:px-2 flex flex-col my-6 px-3">
                    <div className="flex flex-wrap">
                        {/* Sadece super_admin için Aside göster */}
                        {hasPermission("super_admin") && (
                            <div className="w-full lg:w-1/4 px-3">
                                <Aside />
                            </div>
                        )}

                        {/* Aside'ın görünürlüğüne göre genişliği ayarla */}
                        <div
                            className={`w-full ${hasPermission("super_admin") ? "lg:w-3/4" : "lg:w-full"} px-3`}
                        >
                            <h1 className="text-xl font-bold mb-4">
                                {t("Hoş Geldiniz!")}
                            </h1>
                            <div className="navigation-tab">
                                <div className="tabs-menu my-8">
                                    <ul
                                        className="nav nav-tabs flex"
                                        role="tablist"
                                    >
                                        {/* İlanlarım sadece admin ve super_admin tarafından görülebilir */}
                                        {/* {hasPermission('admin_or_higher') && (
                                            <li className="nav-item" role="presentation">
                                                <Link to={ROUTES.UI.ADVERT}
                                                      className="nav-link py-2 px-4"
                                                >
                                                    <span>{t('İlanlarım')}</span>
                                                </Link>
                                            </li>
                                        )} */}

                                        {/* Aşağıdaki linkler herkes tarafından görülebilir */}
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            {/* <Link to={ROUTES.UI.MY_RESERVATIONS}
                                                  className="nav-link py-2 px-4"
                                            >
                                                <span>{t('Rezervasyonlarım')}</span>
                                            </Link> */}
                                        </li>
                                        {/* <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <Link
                                                to={ROUTES.UI.MY_COMMENTS}
                                                className="nav-link py-2 px-4"
                                            >
                                                <span>{t("Yorumlarım")}</span>
                                            </Link>
                                        </li> */}
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <Link
                                                to={ROUTES.UI.ACCOUNT_SETTING}
                                                className="nav-link py-2 px-4"
                                            >
                                                <span>{t("Ayarlar")}</span>
                                            </Link>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <Link
                                                to={ROUTES.UI.MY_FAVORITE}
                                                className="nav-link py-2 px-4"
                                            >
                                                <span>{t("Favorilerim")}</span>
                                            </Link>
                                        </li>
                                        {/* şimdilik yorum satırında
                                        <li className="nav-item" role="presentation">*/}
                                        {/*    <Link to={ROUTES.UI.COUPON_CODE}*/}
                                        {/*          className="nav-link py-2 px-4"*/}
                                        {/*    >*/}
                                        {/*        <span>{t('Kupon Kodu')}</span>*/}
                                        {/*    </Link>*/}
                                        {/*</li>*/}
                                    </ul>
                                </div>
                                <Suspense fallback={<Loader />}>
                                    <Outlet />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PanelLayout;
