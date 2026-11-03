import React, { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

const AdvertFeature = ({ data, vals = [] }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();

    const featurePath = "attr.features";

    useEffect(() => {
        if (vals && vals.length > 0) {
            const initialFeatures = vals.map(val => ({
                id: val.id || "",
                value: val.value || ""
            }));
            setFieldValue(featurePath, initialFeatures);
        } else if (!values?.attr?.features || values.attr.features.length === 0) {
            setFieldValue(featurePath, [{ id: "", value: "" }]);
        }
    }, [vals]);

    useEffect(() => {
        console.log("Form values:", values);
    }, [values]);

    const addFeature = () => {
        const updated = [...(values.attr?.features || []), { id: "", value: "" }];
        setFieldValue(featurePath, updated);
    };

    const removeFeature = (index) => {
        const updated = values.attr.features.filter((_, i) => i !== index);
        setFieldValue(featurePath, updated);
    };

    if (!values?.attr?.features) return null;

    return (
        <div className="feature-repeater">
            {values.attr.features.map((feature, index) => (
                <div key={index} className="feature-item grid lg:grid-cols-12 gap-6 mt-2">
                    {/* Özellik Seçimi */}
                    <div className="col-span-5">
                        <label htmlFor={`feature_id_${index}`} className="block text-gray-700 font-semibold">
                            {t('Özellik')}
                        </label>
                        <Field name={`attr.features[${index}].id`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`feature_id_${index}`}
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
                        <label htmlFor={`feature_value_${index}`} className="block text-gray-700 font-semibold">
                            {t("Açıklama")}
                        </label>
                        <Field
                            type="text"
                            id={`feature_value_${index}`}
                            name={`attr.features[${index}].value`}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>

                    {/* Sil */}
                    <div className="col-span-2">
                        <label>&nbsp;</label>
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="btn delete-btn"
                        >
                            <i className="icon trash"></i> {t("Sil")}
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addFeature}
                className="btn add-btn mt-2"
            >
                <i className="icon plus"></i> {t("Ekle")}
            </button>
        </div>
    );
};

export default AdvertFeature;
