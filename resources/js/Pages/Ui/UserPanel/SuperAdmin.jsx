import React from "react";
import Header from "../../../Components/UI/Header/Header";
import Aside from "./Aside";

const SuperAdmin = () => {
    return (
        <div className="inner-page superadmin panel">
            <Header />
            <div className="max-w-9xl mx-auto sm:px-2 md:px-2 flex flex-col my-6 px-3">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/4 px-3">
                        <Aside />
                    </div>
                    <div className="w-full lg:w-3/4 px-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuperAdmin;