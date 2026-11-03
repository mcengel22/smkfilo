import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const ManualForm = ({ onSave }) => {
    const { t } = useTranslation();

    // 🔧 Başlangıç değerleri
    const initialValues = {
        note: "Manuel rezervasyon",
        name: "Manuel",
        surname: "Rezervasyon",
        phone: "0000 000 00 00",
        email: "manuel@rezervasyon.com",
        adult_count: "0",
        child_count: "0",
        infant_count: "0",
        damage_deposit: "0",
        type: "credit",
        total_price: "0",
    };

    // ✅ Zorunlu alanlar
    const validationSchema = Yup.object({
        note: Yup.string().required(t("Not alanı zorunlu.")),
        name: Yup.string().required(t("İsim alanı zorunlu.")),
        surname: Yup.string().required(t("Soyisim alanı zorunlu.")),
        phone: Yup.string().required(t("Telefon numarası zorunlu.")),
        email: Yup.string().required(t("Email alanı zorunlu.")),
        adult_count: Yup.string().required(t("Yetişkin sayısı zorunlu.")),
        child_count: Yup.string().required(t("Çocuk sayısı zorunlu.")),
        infant_count: Yup.string().required(t("Bebek sayısı zorunlu.")),
        type: Yup.string().required(t("Ödeme yöntemi zorunlu.")),
        total_price: Yup.string().required(t("Toplam tutar zorunlu.")),
    });

    return (
        <div>
            <h5 className="text-center mb-2 font-semibold">
                {t("Manuel Rezervasyon")}
            </h5>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => onSave(values)} // ✅ Doğru
            >
                {({ isSubmitting }) => (
                    <Form>
                        {/* 🎯 Not */}
                        <div className="form-group mb-1">
                            <label>{t("Not")} *</label>
                            <Field name="note" className="w-full" />
                            <ErrorMessage
                                name="note"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        {/* 👤 Misafir Bilgileri */}
                        <div className="form-group mb-1">
                            <label>{t("İsim")} *</label>
                            <Field name="name" className="w-full" />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t("Soyisim")} *</label>
                            <Field name="surname" className="w-full" />
                            <ErrorMessage
                                name="surname"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t("Telefon")} *</label>
                            <Field name="phone" className="w-full" />
                            <ErrorMessage
                                name="phone"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t("Email")} *</label>
                            <Field name="email" className="w-full" />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        {/* 👨‍👩‍👧 Kişi Bilgileri */}
                        {/* <div className="form-group mb-1">
                            <label>{t('Yetişkin Sayısı')} *</label>
                            <Field name="adult_count" type="number" className="w-full" />
                            <ErrorMessage name="adult_count" component="div" className="error-input" />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t('Çocuk Sayısı')} *</label>
                            <Field name="child_count" type="number" className="w-full" />
                            <ErrorMessage name="child_count" component="div" className="error-input" />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t('Bebek Sayısı')} *</label>
                            <Field name="infant_count" type="number" className="w-full" />
                            <ErrorMessage name="infant_count" component="div" className="error-input" />
                        </div> */}

                        {/* 💵 Ödeme Bilgileri */}
                        <div className="form-group mb-1">
                            <label>{t("Hasar Depozito")}</label>
                            <Field name="damage_deposit" className="w-full" />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t("Ödeme Yöntemi")} *</label>
                            <Field as="select" name="type" className="w-full">
                                <option value="credit">
                                    {t("Kredi Kartı")}
                                </option>
                                <option value="eft">{t("Havale & EFT")}</option>
                            </Field>
                            <ErrorMessage
                                name="type"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        <div className="form-group mb-1">
                            <label>{t("Toplam Tutar")} *</label>
                            <Field
                                name="total_price"
                                type="number"
                                className="w-full"
                            />
                            <ErrorMessage
                                name="total_price"
                                component="div"
                                className="error-input"
                            />
                        </div>

                        {/* 🔘 Buton */}
                        <div className="mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary mt-3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t("Kaydediliyor...")
                                    : t("Kaydet")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ManualForm;
