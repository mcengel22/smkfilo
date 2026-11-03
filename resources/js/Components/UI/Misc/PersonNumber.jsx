import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../../../Repo/Redux/Modules/FilterSlice";

const PersonNumber = ({ personCount = null, maxAdult = 10, maxChild = 4, maxBaby = 2, onPersonCountChange }) => {
    const dispatch = useDispatch();

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // locals state yerine Redux'tan gelen değerleri doğrudan kullanacağız
    const personCounts = {
        adult: personCount?.adult ?? personCount?.adult ?? 0,
        child: personCount?.child ?? personCount?.child ?? 0,
        baby: personCount?.baby ?? personCount?.baby ?? 0,
    };

    const personTypes = [
        { label: "Yetişkin", key: "adult", ageRange: "18 yaş ve üzeri" },
        { label: "Çocuk", key: "child", ageRange: "2-17 yaş arası" },
        { label: "Bebek", key: "baby", ageRange: "0-2 yaş arası" },
    ];

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
        setActiveDropdown("person");
    };

    const updateCount = (type, operation) => {
        const newCounts = { ...personCounts };
        const maxValues = {
            adult: maxAdult,
            child: maxChild,
            baby: maxBaby
        };

        if (operation === "increment") {
            if (newCounts[type] < maxValues[type]) {
                newCounts[type] += 1;
            }
        } else if (operation === "decrement" && newCounts[type] > 0) {
            newCounts[type] -= 1;
        }

        // Değişiklik varsa onPersonCountChange'i tetikle
        if (newCounts[type] !== personCounts[type]) {
            onPersonCountChange(newCounts);
        }
    };

    const getDisplayText = () => {
        const { adult, child, baby } = personCounts;
        let text = "";
        if (adult > 0) text += `${adult} Yetişkin`;
        if (child > 0) text += (text ? ", " : "") + `${child} Çocuk`;
        if (baby > 0) text += (text ? ", " : "") + `${baby} Bebek`;
        return text || "Kişiler";
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`${activeDropdown === "person" ? "z-10" : "z-0"}`}>
            <div className="banner-property-grid person-select">
                <div
                    className="person-number cursor-pointer"
                    onClick={toggleDropdown}
                >
                    <span className="kisiSayisiText">
                        {getDisplayText()}
                    </span>
                </div>
                {dropdownVisible && (
                    <div
                        className="person-menu"
                        ref={dropdownRef}
                    >
                        <div
                            className="close flex justify-end cursor-pointer text-gray-500"
                            onClick={() => setDropdownVisible(false)}
                        >
                            <i className="icon xmark"></i>
                        </div>
                        {personTypes.map(({ label, key, ageRange }) => (
                            <div key={key} className="flex justify-between py-2 ">
                                <div>
                                    <span className="font-medium">{label}</span>
                                    <p className="text-xs text-gray-500">{ageRange}</p>
                                </div>
                                <div className="flex items-center counter">
                                    <button
                                        type="button"
                                        className="decrease"
                                        onClick={() => updateCount(key, "decrement")}
                                    >
                                        -
                                    </button>
                                    <span>{personCounts[key]}</span>
                                    <button
                                        type="button"
                                        className="increment"
                                        onClick={() => updateCount(key, "increment")}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonNumber;
