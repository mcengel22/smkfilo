import React, { Suspense } from "react";
import TopHeader from "./Misc/TopHeader";
import { Link, Outlet } from 'react-router-dom';
import Footer from "./Misc/Footer";
import HomeLoad from "../../../Pages/Ui/Home/Load";
import Header from "../../../Components/UI/Header/Header";
import Loader from "../../../Components/Loader";
const Ui = () => {
    return (
        <div>

            <HomeLoad />
            <TopHeader />
            {/* <div className="inner-page detail-page">
                <Header />
            </div> */}
            {/* Sayfa kodu yüklenirken header/footer yerinde kalır */}
            <Suspense fallback={<div className="min-h-[60vh]"><Loader /></div>}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};

export default Ui;
