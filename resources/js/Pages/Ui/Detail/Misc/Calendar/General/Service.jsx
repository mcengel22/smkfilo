import React from "react";
import PropTypes from 'prop-types';

const TabService = ({ service, className, iconClass }) => {
    const status = className === "free" ? "Uygun Değil" : "Uygun";

    return (
        <li className={`service ${className}`}>
            <i className={`icon ${iconClass}`}></i>
            <span className="fw-bold">{service}</span>
            <span>{status}</span>
        </li>
    );
};

TabService.propTypes = {
    service: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
};

export default TabService;
