import React from "react";
import { Link } from "react-router-dom";
import {ROUTES} from "../../../Libs/Routes/config";

const Breadcrumb = ({name = null}) => {
    // node değerini güvenli bir şekilde görüntülemek için yardımcı fonksiyon

    return (
        <div>
            {/* <!-- Breadcrumb --> */}
            <div className="breadcrumb">
                <nav>
                    <ul className="breadcrumb-links">
                        <li>
                            <Link to={ROUTES.UI.LANDING} className="breadcrumb-box">
                                <span className="breadcrumb-text">Anasayfa</span>
                            </Link>
                        </li>
                        <li>
                            <div className="breadcrumb-box">
                                <i className="icon chevron-right"></i>
                                <span className="breadcrumb-text">{name || ""}</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Breadcrumb;
