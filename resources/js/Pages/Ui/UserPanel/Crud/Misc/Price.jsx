import React, { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

const AdvertPrice = ({ vals = [] }) => {
    const { t } = useTranslation();

    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        if (vals && vals.length > 0) {
            const initialPrices = vals.map((val) => ({
                years: val.years || "",
                km: val.km || "",
                value: val.price || "",
            }));

            setFieldValue("prices", initialPrices);
        } else if (!values.prices || values.prices.length === 0) {
            setFieldValue("prices", [
                {
                    years: "",
                    km: "",
                    value: "",
                },
            ]);
        }
    }, [vals]);

    const addPrice = () => {
        setFieldValue("prices", [
            ...values.prices,
            {
                years: "",
                km: "",
                value: "",
            },
        ]);
    };

    const removePrice = (index) => {
        const updatedPrices = values.prices.filter((_, i) => i !== index);

        setFieldValue("prices", updatedPrices);
    };

    if (!values.prices) return null;

    return (
        <div className="space-y-4">
            {values.prices.map((price, index) => (
                <div
                    key={index}
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-12
                        gap-4
                        items-end
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                    "
                >
                    {/* Yıl */}
                    <div className="lg:col-span-3">
                        <label
                            htmlFor={`price_years_${index}`}
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            {t("Yıl")}
                        </label>

                        <Field
                            type="number"
                            min="1"
                            name={`prices[${index}].years`}
                            id={`price_years_${index}`}
                            placeholder="1"
                            className="
                                border
                                border-gray-300
                                rounded-xl
                                p-3
                                w-full
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary
                            "
                        />
                    </div>

                    {/* KM */}
                    <div className="lg:col-span-3">
                        <label
                            htmlFor={`price_km_${index}`}
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            {t("KM")}
                        </label>

                        <Field
                            type="number"
                            min="0"
                            name={`prices[${index}].km`}
                            id={`price_km_${index}`}
                            placeholder="10000"
                            className="
                                border
                                border-gray-300
                                rounded-xl
                                p-3
                                w-full
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary
                            "
                        />
                    </div>

                    {/* Fiyat */}
                    <div className="lg:col-span-4">
                        <label
                            htmlFor={`price_value_${index}`}
                            className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            {t("Fiyat")}
                        </label>

                        <Field
                            type="number"
                            min="0"
                            name={`prices[${index}].value`}
                            id={`price_value_${index}`}
                            placeholder="450000"
                            className="
                                border
                                border-gray-300
                                rounded-xl
                                p-3
                                w-full
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary
                            "
                        />
                    </div>

                    {/* Sil */}
                    <div className="lg:col-span-2">
                        <button
                            type="button"
                            onClick={() => removePrice(index)}
                            className="
                                w-full
                                h-[52px]
                                rounded-xl
                                border
                                border-red-200
                                text-red-600
                                font-semibold
                                hover:bg-red-50
                                transition
                            "
                        >
                            <i className="icon trash me-2"></i>
                            {t("Sil")}
                        </button>
                    </div>
                </div>
            ))}

            {/* EKLE */}
            <button
                type="button"
                onClick={addPrice}
                className="
                    h-[52px]
                    px-6
                    rounded-xl
                    bg-primary
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                "
            >
                <i className="icon plus me-2"></i>

                {t("Paket Ekle")}
            </button>
        </div>
    );
};

export default AdvertPrice;
