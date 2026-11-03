import React from "react";
import PropTypes from 'prop-types';

const TabCategory = ({ name }) => {
    return (

        <div className="feature">
            <i className="icon big-home"></i>
            <span className="fw-bold text-center">{name}</span>
        </div>
    )
}

TabCategory.propTypes = {
    name: PropTypes.string.isRequired,
};

export default TabCategory;