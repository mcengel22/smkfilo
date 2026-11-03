import React, { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

const AdvertNearby = ({ data, vals = [] }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();

    const nearbyPath = "attr.near";

    useEffect(() => {
        if (vals && vals.length > 0) {
            const initialNearby = vals.map(val => ({
                id: val.id || "",
                value: val.value || ""
            }));
            setFieldValue(nearbyPath, initialNearby);
        } else if (!values?.attr?.near || values.attr.near.length === 0) {
            setFieldValue(nearbyPath, [{ id: "", value: "" }]);
        }
    }, [vals]);

    const addNearby = () => {
        const updated = [...(values.attr?.near || []), { id: "", value: "" }];
        setFieldValue(nearbyPath, updated);
    };

    const removeNearby = (index) => {
        const updated = values.attr.near.filter((_, i) => i !== index);
        setFieldValue(nearbyPath, updated);
    };

    if (!values?.attr?.near) return null;

    return (
        <div>
            {values.attr.near.map((nearby, index) => (
                <div key={index} className="nearby-item grid lg:grid-cols-12 gap-6 mt-2">
                    {/* Markalar tipi seçimi */}
                    <div className="col-span-5">
                        <label htmlFor={`nearby_id_${index}`} className="block text-gray-700 font-semibold">
                            {t("Markalar")}
                        </label>
                        <Field name={`attr.near[${index}].id`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`nearby_id_${index}`}
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

                    {/* Açıklama */}
                    <div className="col-span-5">
                        <label htmlFor={`nearby_value_${index}`} className="block text-gray-700 font-semibold">
                            {t("Açıklama")}
                        </label>
                        <Field
                            type="text"
                            id={`nearby_value_${index}`}
                            name={`attr.near[${index}].value`}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>

                    {/* Sil butonu */}
                    <div className="col-span-2">
                        <label>&nbsp;</label>
                        <button
                            type="button"
                            onClick={() => removeNearby(index)}
                            className="btn delete-btn"
                        >
                            <i className="icon trash"></i> {t("Sil")}
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addNearby} className="btn add-btn mt-2">
                <i className="icon plus"></i> {t("Ekle")}
            </button>
        </div>
    );
};

export default AdvertNearby;
