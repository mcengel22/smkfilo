import React from "react";
import PropTypes from 'prop-types';

const TabNearby = ({ service, value, iconClass }) => {
    return (
        <div className="nearby-item">
            <div className="img me-2">
                <i className={`icon ${iconClass}`}></i>
            </div>
            <span className="flex flex-col name">
                {service}
                <span className="km">
                    {value}
                </span>
            </span>
        </div>
    )
}

TabNearby.propTypes = {
    iconClass: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    value: PropTypes.string,
};

export default TabNearby;
