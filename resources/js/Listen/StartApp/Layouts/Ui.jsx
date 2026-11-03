import React from "react";
import TopHeader from "./Misc/TopHeader";
import { Link, Outlet } from 'react-router-dom';
import Footer from "./Misc/Footer";
import HomeLoad from "../../../Pages/Ui/Home/Load";
import Header from "../../../Components/UI/Header/Header";
const Ui = () => {
    return (
        <div>

            <HomeLoad />
            <TopHeader />
            {/* <div className="inner-page detail-page">
                <Header />
            </div> */}
            <Outlet />
            <Footer />
        </div>
    );
};

export default Ui;
