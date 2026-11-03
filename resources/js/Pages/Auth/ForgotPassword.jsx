import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t('Geçerli bir email adresi giriniz'))
            .required(t('Email adresi zorunludur')),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setIsLoading(true);
        try {
            console.log("Şifre sıfırlama isteği başarılı:", values);
            // API isteği buraya eklenecek
        } catch (error) {
            console.error("Şifre sıfırlama hatası:", error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="header">
                <h1>{t('Şifremi Unuttum')}</h1>
                <p>
                    {t('Kayıtlı e-posta adresinize, şifrenizi değiştirmeniz için bir şifre değiştirme linki göndereceğiz.')}
                </p>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">{t('E-posta Adresi')}</label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                placeholder="ornek@email.com"
                                className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                            />
                            {errors.email && touched.email && (
                                <div className="error-input">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? "Lütfen bekleyin..." : "Şifre Sıfırlama Linki Gönder"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ForgotPassword;
