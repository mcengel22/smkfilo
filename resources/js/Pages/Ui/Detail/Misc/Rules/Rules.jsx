import React from "react";
import PropTypes from 'prop-types';

const TabRules = ({ service, className, iconClass }) => {

    return (
        <li className={`rules ${className}`}>
            <i className={`icon ${iconClass}`}></i>
            <span className="fw-bold">{service}</span>
        </li>

    )
}

TabRules.propTypes = {
    iconClass: PropTypes.string,
    service: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default TabRules;
