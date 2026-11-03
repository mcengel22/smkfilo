import React from "react";
import PropTypes from 'prop-types';
const TabStatus = ({ icon, name, value }) => {
    return (
        <div className="feature">
            <i className={`icon ${icon}`}></i>
            <span className="fw-bold">{value}</span>
            <span className="sub">{name}</span>
        </div>
    )
}


TabStatus.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default TabStatus;
