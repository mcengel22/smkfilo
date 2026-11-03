import React from "react";

const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="inset-0 z-50 flex items-center justify-center fixed bg-opacity-50 bg-black">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full canvas-modal">
                <button className="close-btn bg-red-500 rounded-full me-3 absolute right-0 text-white text-xl"
                    onClick={onClose} style={{ width: "1.8rem", height: "1.8rem" }}>
                    &times;
                </button>

                {children}
            </div>
        </div>
    );
};

export default CustomModal;
