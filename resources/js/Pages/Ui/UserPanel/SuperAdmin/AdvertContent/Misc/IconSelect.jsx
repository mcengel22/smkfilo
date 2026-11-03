import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useTranslation } from "react-i18next";
import { useIcons } from "../../../../../../ServerSide/Hooks/useIcons";
import { useFormikContext } from "formik";

// Custom Option JSX
const IconOption = (props) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center">
                <i className={`icon ${props.data.icon_class} mr-2`} />
                {props.data.label}
            </div>
        </components.Option>
    );
};

// Custom SingleValue JSX
const IconSingleValue = (props) => {
    return (
        <components.SingleValue {...props}>
            <div className="flex items-center">
                <i className={`icon ${props.data.icon_class} mr-2`} />
                {props.data.label}
            </div>
        </components.SingleValue>
    );
};

const IconSelect = ({ currentIconClass }) => {
    const { t } = useTranslation();
    const { select2Icons } = useIcons();
    const { setFieldValue } = useFormikContext();

    const [options, setOptions] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentIconClass?.value) {
            setSelectedIcon(currentIconClass);
            setFieldValue("info", currentIconClass.value);
        }
    }, [currentIconClass]);

    useEffect(() => {
        let mounted = true;

        const getIcons = async () => {
            try {
                const data = await select2Icons();
                const formatted = data.map((icon) => ({
                    value: icon.icon_class,
                    label: icon.label,
                    icon_class: icon.icon_class,
                }));

                if (mounted) {
                    setOptions(formatted);

                    // Eğer currentIconClass string olarak verilmişse, option objesi bul
                    if (currentIconClass?.value) {
                        const selected = formatted.find(opt => opt.value === currentIconClass.value);
                        if (selected) {
                            setSelectedIcon(selected);
                            setFieldValue("info", selected.value);
                        }
                    }
                }
            } catch (err) {
                console.error("İkonlar alınırken hata:", err);
                if (mounted) {
                    setError(t("İkonlar yüklenirken bir hata oluştu"));
                }
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        getIcons();
        return () => { mounted = false };
    }, []);

    const handleIconChange = (icon) => {
        setSelectedIcon(icon);
        setFieldValue("info", icon?.value || "");
    };

    return (
        <div>
            {isLoading ? (
                <div className="text-sm text-gray-500">{t("Yükleniyor...")}</div>
            ) : (
                <Select
                    value={selectedIcon}
                    onChange={handleIconChange}
                    options={options}
                    placeholder={t("İkon seçiniz")}
                    isSearchable
                    isClearable
                    className="custom-select mt-1"
                    classNamePrefix="select"
                    components={{ Option: IconOption, SingleValue: IconSingleValue }}
                />
            )}
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};


export default IconSelect;
