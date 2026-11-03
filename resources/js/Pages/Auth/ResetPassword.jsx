import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PasswordStrengthBar from "@/Components/UI/Misc/PasswordStrength.jsx";

const ResetPassword = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        password: "",
        password_confirmation: "",
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, t('Şifre en az 8 karakter olmalıdır'))
            .matches(/[A-Z]/, t('Şifre en az 1 büyük harf içermelidir'))
            .matches(/[0-9]/, t('Şifre en az 1 rakam içermelidir'))
            .matches(/[\W_]/, t('Şifre en az 1 sembol içermelidir'))
            .required(t('Şifre zorunludur')),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], t('Şifreler eşleşmiyor'))
            .required(t('Şifre zorunludur')),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        try {
            console.log("Şifre yenileme isteği başarılı:", values);
            // API isteği buraya eklenecek
        } catch (error) {
            console.error("Şifre yenileme hatası:", error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <div>
            <div className="header">
                <h1>{t('Şifremi Yenile')}</h1>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, values }) => (
                    <Form className="login-form">
                        <div className="form-group">
                            <label htmlFor="password">{t('Şifre')}</label>
                            <div className="pass-input">
                                <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('Şifre')}
                                    className={`form-control p-2 ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="flex items-center"
                                >
                                    <i className={`icon ${showPassword ? 'eye' : 'eye-slash'}`}></i>
                                </span>
                            </div>
                            {errors.password && touched.password && (
                                <div className="error-input">
                                    {errors.password}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_confirmation">{t('Şifre Tekrar')}</label>
                            <div className="pass-input">
                                <Field
                                    name="password_confirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    placeholder={t('Şifre Tekrar')}
                                    className={`form-control p-2 ${errors.password_confirmation && touched.password_confirmation ? 'is-invalid' : ''}`}
                                />
                                <span
                                    onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                    className="d-flex align-items-center"
                                >
                                    <i className={`icon ${showPasswordConfirmation ? 'eye' : 'eye-slash'}`}></i>
                                </span>
                            </div>
                            {errors.password_confirmation && touched.password_confirmation && (
                                <div className="error-input">
                                    {errors.password_confirmation}
                                </div>
                            )}
                        </div>
                        <div className="my-2">
                            <PasswordStrengthBar className="pass-strength" password={values.password} />
                            <span className="pass-info">
                                {t('Lütfen en az 8 karakter, 1 büyük harf, 1 rakam ve 1 sembol içeren bir şifre giriniz.')}
                            </span>
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? "Lütfen bekleyin..." : "Gönder"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ResetPassword;
