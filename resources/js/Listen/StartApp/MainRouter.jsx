import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UiLayout from './Layouts/Ui';
import HomePage from '../../Pages/Ui/Home/Home';
import { ROUTES } from '../../Libs/Routes/config';
import Listing from '../../Pages/Ui/Listing/Listing';
import AuthLayout from "./Layouts/Auth";
import Login from "../../Pages/Auth/Login";
import Register from "../../Pages/Auth/Register";
import ForgotPassword from "../../Pages/Auth/ForgotPassword";
import TwoFactor from "../../Pages/Auth/TwoFactor";
import ResetPassword from "../../Pages/Auth/ResetPassword";
import Detail from '../../Pages/Ui/Detail/Detail';
import BlogListing from '../../Pages/Ui/Blog/BlogListing';
import BlogDetail from '../../Pages/Ui/Blog/BlogDetail';
import CampaignListing from '../../Pages/Ui/Campaign/CampaignListing';
import CampaignDetail from '../../Pages/Ui/Campaign/CampaignDetail';
import About from '../../Pages/Ui/About/About';
import Institutional from '../../Pages/Ui/Institutional/Institutional'
import Contact from '../../Pages/Ui/Contact/Contact';
import Agreements from '../../Pages/Ui/Agreements/Agreements';
import PrivacyAgreement from '../../Pages/Ui/Agreements/Misc/PrivacyAgreement';
import CancellationConditions from '../../Pages/Ui/Agreements/Misc/CancellationConditions';
import RentalAgreemenmt from '../../Pages/Ui/Agreements/Misc/RentalAgreement';
import Reservation from '../../Pages/Ui/Reservation/Reservation';
import Payment from '../../Pages/Ui/Reservation/Payment';
import Transfer from '../../Pages/Ui/Reservation/Transfer';
import PaymentSuccess from '../../Pages/Ui/Reservation/Misc/PaymentSuccess';
import PaymentError from '../../Pages/Ui/Reservation/Misc/PaymentError';
import UserPanel from '../../Pages/Ui/UserPanel/UserPanel';
import PostCreate from '../../Pages/Ui/UserPanel/Crud/PostCreate';
import SuperAdmin from '../../Pages/Ui/UserPanel/SuperAdmin';
import UserList from '../../Pages/Ui/UserPanel/SuperAdmin/Users/List';
import UserCreate from '../../Pages/Ui/UserPanel/SuperAdmin/Users/Create';
import UserEdit from '../../Pages/Ui/UserPanel/SuperAdmin/Users/Edit';
import CampaignList from '../../Pages/Ui/UserPanel/SuperAdmin/Campaign/List';
import CampaignCreate from '../../Pages/Ui/UserPanel/SuperAdmin/Campaign/Create';
import Showcase from '../../Pages/Ui/UserPanel/SuperAdmin/Showcase/Create';
import CommunicationList from '../../Pages/Ui/UserPanel/SuperAdmin/ContactForm/List';
import ReservationList from '../../Pages/Ui/UserPanel/SuperAdmin/Reservation/List';
import ReservationCreate from '../../Pages/Ui/UserPanel/SuperAdmin/Reservation/Create';
import OperationsList from '../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Operation/List';
import FeaturesList from '../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Features/List';
import RulesList from '../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Rules/List';
import CampaignEdit from '../../Pages/Ui/UserPanel/SuperAdmin/Campaign/Edit';
import Coupon from '../../Pages/Ui/UserPanel/SuperAdmin/Coupon/Create';
import CouponEdit from '../../Pages/Ui/UserPanel/SuperAdmin/Coupon/Edit';
import ShowcaseEdit from '../../Pages/Ui/UserPanel/SuperAdmin/Showcase/Edit';
import Comments from '../../Pages/Ui/UserPanel/SuperAdmin/Comments/List';
import Kvkk from '../../Pages/Ui/Agreements/Misc/Kvkk';
import ConsentText from '../../Pages/Ui/Agreements/Misc/ConsentText';
import TermsOfUse from '../../Pages/Ui/Agreements/Misc/TermsOfUse';
import PanelLayout from './Layouts/Panel';
import MyAdvert from '../../Pages/Ui/UserPanel/Misc/Setting/MyAdvert';
import UserReservation from '../../Pages/Ui/UserPanel/Misc/UserReservation';
import UserReviews from '../../Pages/Ui/UserPanel/Misc/UserReviews';
import UserSetting from '../../Pages/Ui/UserPanel/Misc/UserSetting';
import UserFavorites from '../../Pages/Ui/UserPanel/Misc/UserFavorite';
import CouponPage from '../../Pages/Ui/UserPanel/Misc/CouponPage';
import { useSelector } from 'react-redux';
import AttrCreate from "../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Misc/Create";
import AttrEdit from "../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Misc/Edit";
import CategoriesList from "../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Category/List";
import NearbyList from '../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Nearby/List';
import Loader from "@/Components/Loader.jsx";
import PostEdit from "@/Pages/Ui/UserPanel/Crud/PostEdit.jsx";
import ReservationManagement from "../../Pages/Ui/Reservation/ReservationManagement";
import HomeRequestsList from "../../Pages/Ui/UserPanel/SuperAdmin/HomeRequests/List";
import SeoList from "../../Pages/Ui/UserPanel/SuperAdmin/Seo/List";
import SeoCreate from "../../Pages/Ui/UserPanel/SuperAdmin/Seo/Create";
import SeoEdit from "../../Pages/Ui/UserPanel/SuperAdmin/Seo/Edit";
import BlogList from "../../Pages/Ui/UserPanel/SuperAdmin/Blog/List";
import BlogCreate from "../../Pages/Ui/UserPanel/SuperAdmin/Blog/Create";
import BlogEdit from "../../Pages/Ui/UserPanel/SuperAdmin/Blog/Edit";
import FaqList from "@/Pages/Ui/UserPanel/SuperAdmin/Faq/List.jsx";
import FaqAdd from "@/Pages/Ui/UserPanel/SuperAdmin/Faq/Create.jsx";
import FaqEdit from "@/Pages/Ui/UserPanel/SuperAdmin/Faq/Edit.jsx";
import FvList from "@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/List.jsx";
import FvAdd from "@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/Create.jsx";
import FvEdit from "@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/Edit.jsx";
import PoliciesList from "@/Pages/Ui/UserPanel/SuperAdmin/Policies/PoliciesList.jsx";
import Reports from "@/Pages/Ui/UserPanel/SuperAdmin/Reports/Reports.jsx";
import SupportTicketList from '../../Pages/Ui/UserPanel/SuperAdmin/SupportTicket/List';
import Dealers from '../../Pages/Ui/UserPanel/Dealers';
import KmPackagesList from '../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/List';
import KmPackagesAdd from '../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/Create';
import KmPackagesEdit from '../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/Edit';


// İzin kontrolü için koruma bileşeni
const ProtectedRoute = ({ children, requiredPermission }) => {
    const user = useSelector(state => state.auth.user);
    const isLoading = useSelector(state => state.auth.loading);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);




    // Yetki kontrolü
    const hasPermission = () => {
        // Yükleme durumunda loading komponenti göster
        if (isLoading) {
            return (
                <Loader/>
            );
        }else {
            if (!user) {
                return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
            }
        }

        if (!requiredPermission) return true;

        switch (requiredPermission) {
            case 'super_admin':
                return user.type === 'super_admin';
            case 'admin_or_higher':
                return ['admin', 'super_admin'].includes(user.type);
            case 'any_user':
                return ['user', 'admin', 'super_admin'].includes(user.type);
            default:
                return false;
        }
    };

    if (!hasPermission()) {
        return <Navigate to={ROUTES.UI.LANDING} replace />;
    }

    return children;
};

const MainRouter = () => {

    return (
        <Routes>
            {/* Auth Routes */}
            <Route path={ROUTES.UI.USER} element={<AuthLayout />}>
                <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
                <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
                <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={ROUTES.AUTH.TWO_FACTOR} element={<TwoFactor />} />
                <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
                <Route index element={<Navigate to="Giris" replace />} />
            </Route>

            {/* Public UI Routes */}
            <Route element={<UiLayout />}>
                <Route path={ROUTES.UI.LANDING} index element={<HomePage />} />
                <Route path={ROUTES.UI.LISTING} element={<Listing />} />
                <Route path={ROUTES.UI.DETAIL + '/:slug'} element={<Detail />} />
                <Route path={ROUTES.UI.BLOG_LISTING} element={<BlogListing />} />
                <Route path={ROUTES.UI.BLOG_DETAIL + '/:slug'} element={<BlogDetail />} />
                <Route path={ROUTES.UI.CAPMAIGN_LISTING} element={<CampaignListing />} />
                <Route path={ROUTES.UI.CAPMAIGN_DETAIL} element={<CampaignDetail />} />
                <Route path={ROUTES.UI.ABOUT} element={<About />} />
                <Route path={ROUTES.UI.INSTITUTIONAL} element={<Institutional />} />
                <Route path={ROUTES.UI.CONTACT} element={<Contact />} />
                <Route path={ROUTES.UI.AGREEMENTS} element={<Agreements />} />
                <Route path={ROUTES.UI.PRİVACY_AGREEMENTS} element={<PrivacyAgreement />} />
                <Route path={ROUTES.UI.CANCELLATİON_CONDİTİONS} element={<CancellationConditions />} />
                <Route path={ROUTES.UI.RENTAL_AGREEMENT} element={<RentalAgreemenmt />} />
                <Route path={ROUTES.UI.KVKK} element={<Kvkk />} />
                <Route path={ROUTES.UI.CONSENT_TEXT} element={<ConsentText />} />
                <Route path={ROUTES.UI.TERMS_OF_USE} element={<TermsOfUse />} />
                <Route path={ROUTES.UI.RESERVATIION} element={<Reservation />} />
                <Route path={ROUTES.UI.PAYMENT} element={<Payment />} />
                <Route path={ROUTES.UI.TRANSFER} element={<Transfer />} />
                <Route path={ROUTES.UI.PAYMENTSUCCESS} element={<PaymentSuccess />} />
                <Route path={ROUTES.UI.PAYMENTERROR} element={<PaymentError />} />
                <Route path={ROUTES.UI.POSTCREATE} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <PostCreate />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.RESERVATİON_MANAGEMENT} element={<ReservationManagement/>} />
                <Route path={ROUTES.UI.POSTEDIT+ '/:slug'} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <PostEdit/>
                    </ProtectedRoute>
                } />


            </Route>

            {/* Panel Routes - İzin kontrolü ile */}
            <Route element={<PanelLayout />}>
                {/* Genel kullanıcı paneli sayfaları */}
                <Route path={ROUTES.UI.USERPANEL} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <UserPanel />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.MY_RESERVATIONS} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <UserReservation />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.MY_COMMENTS} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <UserReviews />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.ACCOUNT_SETTING} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <UserSetting />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.MY_FAVORITE} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <UserFavorites />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.COUPON_CODE} element={
                    <ProtectedRoute requiredPermission="any_user">
                        <CouponPage />
                    </ProtectedRoute>
                } />

                {/* Admin ve Super Admin için erişilebilir rotalar */}
                <Route path={ROUTES.UI.ADVERT} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <MyAdvert />
                    </ProtectedRoute>
                } />

                {/* Sadece Super Admin için erişilebilir rotalar */}
                <Route path={ROUTES.UI.SUPERADMIN} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <SuperAdmin />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CUSTOMER} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <UserList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CUSTOMERADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <UserCreate />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CUSTOMEREDIT+ '/:id'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <UserEdit />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CAMPAIGN} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CampaignList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CAMPAIGNADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CampaignCreate />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CAMPAIGNEDIT + '/:slug'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CampaignEdit />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.RESERVATIONLIST} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <ReservationList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.RESERVATIONCREATE} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <ReservationCreate />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.SHOWCASE} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <Showcase />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.SHOWCASEEDIT+ '/:id'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <ShowcaseEdit />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.COMMUNICATION} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CommunicationList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.CATEGORY} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CategoriesList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.OPERATION} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <OperationsList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.FEATURES} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FeaturesList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.NEARBY} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <NearbyList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.RULES} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <RulesList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.ATTRADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <AttrCreate />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.ATTREDIT + '/:slug'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <AttrEdit />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.COUPON} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <Coupon />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.REPORTS} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <Reports />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.COUPONEDIT} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <CouponEdit />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.COMMENTS} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <Comments />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.HOME_REQUESTS} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <HomeRequestsList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.SEO} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <SeoList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.SEOADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <SeoCreate />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.SEOEDIT + '/:id'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <SeoEdit />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.BLOG} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <BlogList />
                    </ProtectedRoute>
                } />

                {/* 🔹 SSS (FAQ) Yönetimi */}
                <Route path={ROUTES.UI.FAQ} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FaqList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.FAQADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FaqAdd />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.FAQEDIT + '/:id'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FaqEdit />
                    </ProtectedRoute>
                } />

                {/* 🔹 POPULER REGİON Yönetimi */}
                <Route path={ROUTES.UI.FVREGION} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FvList />
                    </ProtectedRoute>
                } />



                <Route path={ROUTES.UI.FVREGIONADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FvAdd />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.FVREGIONEDIT + '/:id'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <FvEdit />
                    </ProtectedRoute>
                } />

                {/* 🔹 POPULER REGİON Yönetimi */}
                <Route path={ROUTES.UI.POLICIES} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <PoliciesList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.BLOGADD} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <BlogCreate />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.BLOGEDIT + '/:slug'} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <BlogEdit />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.SUPPORT_TICKETS} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <SupportTicketList />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.DEALERS} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <Dealers />
                    </ProtectedRoute>
                } />

                <Route path={ROUTES.UI.KM_PACKAGES} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <KmPackagesList />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.KM_PACKAGES_ADD} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <KmPackagesAdd />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.UI.KM_PACKAGES_EDIT + '/:id'} element={
                    <ProtectedRoute requiredPermission="admin_or_higher">
                        <KmPackagesEdit />
                    </ProtectedRoute>
                } />

            </Route>

            {/* Hatalı rota durumunda yönlendirme */}
            <Route path="*" element={<Navigate to={ROUTES.UI.LANDING} replace />} />
        </Routes>
    );
};

export default MainRouter;
