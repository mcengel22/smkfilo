import React from "react";

const TabDesc = ({ desc }) => {
    return (
        <div className="description">
            <div
                className="content"
                dangerouslySetInnerHTML={{ __html: desc }}
            />
        </div>
    );
};

export default TabDesc;
