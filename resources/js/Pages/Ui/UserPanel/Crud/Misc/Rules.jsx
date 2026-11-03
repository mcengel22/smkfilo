import React, { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

const AdvertRules = ({ data, vals = [] }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();

    const rulesPath = "attr.rules";

    useEffect(() => {
        if (vals && vals.length > 0) {
            const initialRules = vals.map(val => ({
                id: val.id || "",
                value: val.value || ""
            }));
            setFieldValue(rulesPath, initialRules);
        } else if (!values?.attr?.rules || values.attr.rules.length === 0) {
            setFieldValue(rulesPath, [{ id: "", value: "" }]);
        }
    }, [vals]);

    const addRule = () => {
        const updated = [...(values.attr?.rules || []), { id: "", value: "" }];
        setFieldValue(rulesPath, updated);
    };

    const removeRule = (index) => {
        const updated = values.attr.rules.filter((_, i) => i !== index);
        setFieldValue(rulesPath, updated);
    };

    if (!values?.attr?.rules) return null;

    return (
        <div>
            {values.attr.rules.map((rule, index) => (
                <div key={index} className="rule-item grid lg:grid-cols-12 gap-6 mt-2">
                    {/* Kural tipi */}
                    <div className="col-span-5">
                        <label htmlFor={`rule_id_${index}`} className="block text-gray-700 font-semibold">
                            {t("Kural")}
                        </label>
                        <Field name={`attr.rules[${index}].id`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`rule_id_${index}`}
                                    className="w-full border border-gray-300 rounded p-2 mt-1"
                                >
                                    <option value="">{t("Seçiniz")}</option>
                                    {data.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </Field>
                    </div>

                    {/* Durum seçimi */}
                    <div className="col-span-5">
                        <label htmlFor={`rule_value_${index}`} className="block text-gray-700 font-semibold">
                            {t("Durum")}
                        </label>
                        <Field name={`attr.rules[${index}].value`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`rule_value_${index}`}
                                    className="w-full border border-gray-300 rounded p-2 mt-1"
                                >
                                    <option value="">{t("Durum Seçiniz")}</option>
                                    <option value="suitable">{t("Uygun")}</option>
                                    <option value="not_suitable">{t("Uygun Değil")}</option>
                                </select>
                            )}
                        </Field>
                    </div>

                    {/* Sil butonu */}
                    <div className="col-span-2">
                        <label>&nbsp;</label>
                        <button
                            type="button"
                            onClick={() => removeRule(index)}
                            className="btn delete-btn"
                        >
                            <i className="icon trash"></i> {t("Sil")}
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addRule} className="btn add-btn mt-2">
                <i className="icon plus"></i> {t("Ekle")}
            </button>
        </div>
    );
};

export default AdvertRules;
