import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UiLayout from './Layouts/Ui';
import HomePage from '../../Pages/Ui/Home/Home';
import { ROUTES } from '../../Libs/Routes/config';
import AuthLayout from "./Layouts/Auth";
import PanelLayout from './Layouts/Panel';
import { useSelector } from 'react-redux';
import Loader from "@/Components/Loader.jsx";

// Sayfalar ihtiyaç anında yüklenir (ana sayfa ve layoutlar hariç)
const Listing = lazy(() => import('../../Pages/Ui/Listing/Listing'));
const Login = lazy(() => import("../../Pages/Auth/Login"));
const Register = lazy(() => import("../../Pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../../Pages/Auth/ForgotPassword"));
const TwoFactor = lazy(() => import("../../Pages/Auth/TwoFactor"));
const ResetPassword = lazy(() => import("../../Pages/Auth/ResetPassword"));
const Detail = lazy(() => import('../../Pages/Ui/Detail/Detail'));
const BlogListing = lazy(() => import('../../Pages/Ui/Blog/BlogListing'));
const BlogDetail = lazy(() => import('../../Pages/Ui/Blog/BlogDetail'));
const CampaignListing = lazy(() => import('../../Pages/Ui/Campaign/CampaignListing'));
const CampaignDetail = lazy(() => import('../../Pages/Ui/Campaign/CampaignDetail'));
const About = lazy(() => import('../../Pages/Ui/About/About'));
const Institutional = lazy(() => import('../../Pages/Ui/Institutional/Institutional'));
const Contact = lazy(() => import('../../Pages/Ui/Contact/Contact'));
const Agreements = lazy(() => import('../../Pages/Ui/Agreements/Agreements'));
const PrivacyAgreement = lazy(() => import('../../Pages/Ui/Agreements/Misc/PrivacyAgreement'));
const CancellationConditions = lazy(() => import('../../Pages/Ui/Agreements/Misc/CancellationConditions'));
const RentalAgreemenmt = lazy(() => import('../../Pages/Ui/Agreements/Misc/RentalAgreement'));
const Reservation = lazy(() => import('../../Pages/Ui/Reservation/Reservation'));
const Payment = lazy(() => import('../../Pages/Ui/Reservation/Payment'));
const Transfer = lazy(() => import('../../Pages/Ui/Reservation/Transfer'));
const PaymentSuccess = lazy(() => import('../../Pages/Ui/Reservation/Misc/PaymentSuccess'));
const PaymentError = lazy(() => import('../../Pages/Ui/Reservation/Misc/PaymentError'));
const UserPanel = lazy(() => import('../../Pages/Ui/UserPanel/UserPanel'));
const PostCreate = lazy(() => import('../../Pages/Ui/UserPanel/Crud/PostCreate'));
const SuperAdmin = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin'));
const UserList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Users/List'));
const UserCreate = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Users/Create'));
const UserEdit = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Users/Edit'));
const CampaignList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Campaign/List'));
const CampaignCreate = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Campaign/Create'));
const Showcase = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Showcase/Create'));
const CommunicationList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/ContactForm/List'));
const ReservationList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Reservation/List'));
const ReservationCreate = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Reservation/Create'));
const OperationsList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Operation/List'));
const FeaturesList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Features/List'));
const RulesList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Rules/List'));
const CampaignEdit = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Campaign/Edit'));
const Coupon = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Coupon/Create'));
const CouponEdit = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Coupon/Edit'));
const ShowcaseEdit = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Showcase/Edit'));
const Comments = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Comments/List'));
const Kvkk = lazy(() => import('../../Pages/Ui/Agreements/Misc/Kvkk'));
const ConsentText = lazy(() => import('../../Pages/Ui/Agreements/Misc/ConsentText'));
const TermsOfUse = lazy(() => import('../../Pages/Ui/Agreements/Misc/TermsOfUse'));
const MyAdvert = lazy(() => import('../../Pages/Ui/UserPanel/Misc/Setting/MyAdvert'));
const UserReservation = lazy(() => import('../../Pages/Ui/UserPanel/Misc/UserReservation'));
const UserReviews = lazy(() => import('../../Pages/Ui/UserPanel/Misc/UserReviews'));
const UserSetting = lazy(() => import('../../Pages/Ui/UserPanel/Misc/UserSetting'));
const UserFavorites = lazy(() => import('../../Pages/Ui/UserPanel/Misc/UserFavorite'));
const CouponPage = lazy(() => import('../../Pages/Ui/UserPanel/Misc/CouponPage'));
const AttrCreate = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Misc/Create"));
const AttrEdit = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Misc/Edit"));
const CategoriesList = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Category/List"));
const NearbyList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/AdvertContent/Nearby/List'));
const PostEdit = lazy(() => import("@/Pages/Ui/UserPanel/Crud/PostEdit.jsx"));
const ReservationManagement = lazy(() => import("../../Pages/Ui/Reservation/ReservationManagement"));
const HomeRequestsList = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/HomeRequests/List"));
const SeoList = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Seo/List"));
const SeoCreate = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Seo/Create"));
const SeoEdit = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Seo/Edit"));
const BlogList = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Blog/List"));
const BlogCreate = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Blog/Create"));
const BlogEdit = lazy(() => import("../../Pages/Ui/UserPanel/SuperAdmin/Blog/Edit"));
const FaqList = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Faq/List.jsx"));
const FaqAdd = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Faq/Create.jsx"));
const FaqEdit = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Faq/Edit.jsx"));
const FvList = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/List.jsx"));
const FvAdd = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/Create.jsx"));
const FvEdit = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Fvpopuler/Edit.jsx"));
const PoliciesList = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Policies/PoliciesList.jsx"));
const Reports = lazy(() => import("@/Pages/Ui/UserPanel/SuperAdmin/Reports/Reports.jsx"));
const SupportTicketList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/SupportTicket/List'));
const Dealers = lazy(() => import('../../Pages/Ui/UserPanel/Dealers'));
const KmPackagesList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/List'));
const KmPackagesAdd = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/Create'));
const KmPackagesEdit = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/KmPackages/Edit'));
const ReferenceList = lazy(() => import('../../Pages/Ui/UserPanel/SuperAdmin/Reference/List'));


// İzin kontrolü için koruma bileşeni
const ProtectedRoute = ({ children, requiredPermission }) => {
    const user = useSelector(state => state.auth.user);
    const isLoading = useSelector(state => state.auth.loading);
    const isAuthChecked = useSelector(state => state.auth.isAuthChecked);
    const location = useLocation();

    // Oturum kontrolü (/me) bitene kadar bekle; aksi halde sayfa yenilemede girişe atar
    if (!isAuthChecked || isLoading) {
        return <Loader/>;
    }

    if (!user) {
        return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
    }

    // Yetki kontrolü
    const hasPermission = () => {
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
                <Route path={ROUTES.UI.REFERENCES} element={
                    <ProtectedRoute requiredPermission="super_admin">
                        <ReferenceList />
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
