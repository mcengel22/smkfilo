
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useUser} from "../../../../../ServerSide/Hooks/useUser";

const ProfilForm = () => {
    const { t } = useTranslation();
    const {updateMeUser}=useUser();
    const user = useSelector(state => state.auth.user);

    // İlk değerlerimizi ayarlıyoruz 🚀
    const initialValues = {
        name: user?.name || "",
        surname: user?.surname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    };

// Validation kurallarımızı yazıyoruz, artık hepsi nullable 🙌
    const validationSchema = Yup.object({
        name: Yup.string().nullable(), // İsim boş geçilebilir
        surname: Yup.string().nullable(), // Soyisim boş geçilebilir
        email: Yup.string().email("Geçerli bir e-posta girin").nullable(), // E-posta boş olabilir ama doluysa formatı kontrol edilir
        phone: Yup.string().nullable(), // Telefon boş geçilebilir
        address: Yup.string().nullable(), // Adres boş geçilebilir
    });


    const handleSubmit = async (values) => {
        const payload = { ...values };

        if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        try {
            await updateMeUser(payload);
            toast.success("Bilgiler güncellendi 🎉");

        } catch (error) {
            console.error("User kaydedilemedi 🚨:", error);
            toast.error("Bir hata oluştu 😓");
        }
    };



    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}

        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <div className="form-grid">
                        <div className="input-grup">
                            <label htmlFor="name">{t('Ad')}</label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                            />
                            {errors.name && touched.name && <div className="error-input">{t(errors.name)}</div>}
                        </div>

                        <div className="input-grup">
                            <label htmlFor="surname">{t('Soyad')}</label>
                            <Field
                                id="surname"
                                name="surname"
                                type="text"
                                className={`form-control ${errors.surname && touched.surname ? "is-invalid" : ""}`}
                            />
                            {errors.surname && touched.surname && <div className="error-input">{t(errors.surname)}</div>}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="input-grup">
                            <label htmlFor="email">{t('E-posta')}</label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                            />
                            {errors.email && touched.email && <div className="error-input">{t(errors.email)}</div>}
                        </div>

                        <div className="input-grup">
                            <label htmlFor="phone">{t('Telefon')}</label>
                            <Field
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`}
                            />
                            {errors.phone && touched.phone && <div className="error-input">{t(errors.phone)}</div>}
                        </div>
                    </div>

                    <div className="input-grup for-style">
                        <label htmlFor="address">{t('Adres')}</label>
                        < Field
                            id="address"
                            as="textarea"
                            name="address"
                            className={`form-control ${errors.address && touched.address ? "is-invalid" : ""}`}
                        />
                        {errors.address && touched.address && <div className="error-input">{t(errors.address)}</div>}
                    </div>

                    <button
                        type="submit"
                        className="kaydet-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t('Güncelleniyor...')
                            : t('Değişiklikleri Kaydet')}
                    </button>

                </Form>
            )}
        </Formik>
    );
};

export default ProfilForm;
