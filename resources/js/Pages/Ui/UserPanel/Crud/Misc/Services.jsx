import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Field, useFormikContext } from "formik";

const AdvertServices = ({ data, vals = [] }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();

    const servicePath = "attr.services";

    useEffect(() => {
        if (vals && vals.length > 0) {
            const initialServices = vals.map(val => ({
                id: val.id || "",
                value: val.value || ""
            }));
            setFieldValue(servicePath, initialServices);
        } else if (!values?.attr?.services || values.attr.services.length === 0) {
            setFieldValue(servicePath, [{ id: "", value: "" }]);
        }
    }, [vals]);

    const addService = () => {
        const updated = [...(values.attr?.services || []), { id: "", value: "" }];
        setFieldValue(servicePath, updated);
    };

    const removeService = (index) => {
        const updated = values.attr.services.filter((_, i) => i !== index);
        setFieldValue(servicePath, updated);
    };

    if (!values?.attr?.services) return null;

    return (
        <div>
            {values.attr.services.map((service, index) => (
                <div key={index} className="service-item grid lg:grid-cols-12 gap-6 mt-2">
                    {/* Yakıt tipi */}
                    <div className="col-span-5">
                        <label htmlFor={`service_id_${index}`} className="block text-gray-700 font-semibold">
                            {t("Yakıt")}
                        </label>
                        <Field name={`attr.services[${index}].id`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`service_id_${index}`}
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

                    {/* Durum */}
                    <div className="col-span-5">
                        <label htmlFor={`service_value_${index}`} className="block text-gray-700 font-semibold">
                            {t("Durum")}
                        </label>
                        <Field name={`attr.services[${index}].value`}>
                            {({ field }) => (
                                <select
                                    {...field}
                                    id={`service_value_${index}`}
                                    className="w-full border border-gray-300 rounded p-2 mt-1"
                                >
                                    <option value="">{t("Durum Seçiniz")}</option>
                                    <option value="paid">{t("Uygun")}</option>
                                    <option value="free">{t("Uygun Değil")}</option>
                                </select>
                            )}
                        </Field>
                    </div>

                    {/* Sil */}
                    <div className="col-span-2">
                        <label>&nbsp;</label>
                        <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="btn delete-btn"
                        >
                            <i className="icon trash"></i> {t("Sil")}
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addService} className="btn add-btn mt-2">
                <i className="icon plus"></i> {t("Ekle")}
            </button>
        </div>
    );
};

export default AdvertServices;
