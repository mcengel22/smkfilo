import React from "react";
import PropTypes from 'prop-types';

const TabFeature = ({ icon, iconClass, feature, sub }) => {
    const cleanIconClass = iconClass
        ? `icon ${iconClass.split('/').pop().replace('.svg', '')}`
        : `icon ${icon}`;

    return (
        <li>
            <i className={cleanIconClass}></i>
            <span className="fw-bold">{feature}:&nbsp;</span>
            <span className="sub">{sub}</span>
        </li>
    );

}

TabFeature.propTypes = {
    icon: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
    feature: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired,
};

TabFeature.defaultProps = {
    iconClass: '',
};


export default TabFeature;