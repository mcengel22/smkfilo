import React from "react";
import PropTypes from 'prop-types';

const TabOtherInfo = ({ icon, other, status, iconClass }) => {
    const iconClassName = iconClass ? `icon ${iconClass}` : `icon ${icon}`;
    return (
        <li>
            <i className={iconClassName}></i>
            <div className="flex flex-col">
                <span className="fw-bold text-sm">{other}</span>
                <span className="sub text-sm">{status}</span>
            </div>
        </li>
    );
}


TabOtherInfo.propTypes = {
    icon: PropTypes.string.isRequired,
    other: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
};

TabOtherInfo.defaultProps = {
    iconClass: '',
};



export default TabOtherInfo;