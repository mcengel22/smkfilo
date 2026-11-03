import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import PasswordStrengthBar from 'react-password-strength-bar';
import { ROUTES } from "@/Libs/Routes/config.jsx";
import {useSelector} from "react-redux";
import { useAuth } from "../../ServerSide/Hooks/Auth/useAuth";
import {toast} from "react-toastify";
import RegionSelect from "../../Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";


const Register = () => {
    const { t } = useTranslation();
    const isLoading = useSelector(state => state.auth.loading);
    const { register } = useAuth();
    const initialValues = {
        name: "",
        surname: "",
        phone: "",
        email: "",
        city_id: "",
        address: "",
        password: "",
        password_confirmation: "",
        type: "user",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t('Ad zorunludur')),
        surname: Yup.string().required(t('Soyad zorunludur')),
        phone: Yup.string().required(t('Telefon numarası zorunludur')),
        email: Yup.string()
            .email(t('Geçerli bir email adresi giriniz'))
            .required(t('Email adresi zorunludur')),
        region_id: Yup.string().required(t('Şehir seçimi zorunludur')),
        address: Yup.string(),
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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            console.log(values);
            const response = await register(values);
            if (response){
                toast.success(t('Kayıt Başarılı. Yönlendiriliyorsunuz!'));
                // Başarılı kayıt sonrası giriş sayfasına yönlendir (tam sayfa yenileme)
                setTimeout(() => {
                    window.location.href = ROUTES.AUTH.LOGIN;
                }, 800);
            }
        } catch (error) {
            toast.error(error.message || t('Kayıt işlemi başarısız'));
        } finally {
            setSubmitting(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <div>
            <div className="register-header">
                <h1>{t('Hesap Oluştur')}</h1>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, values }) => (
                    <Form className="register-form">
                        <div className="form-group flex">
                            <div className="me-2 w-full">
                                <label htmlFor="name">{t('Ad')}</label>
                                <Field id="name" name="name" type="text" placeholder={t('Ad')} className="form-control" />
                                {errors.name && touched.name && <div className="error-input">{errors.name}</div>}
                            </div>
                            <div className="w-full">
                                <label htmlFor="surname">{t('Soyad')}</label>
                                <Field id="surname" name="surname" type="text" placeholder={t('Soyad')} className="form-control" />
                                {errors.surname && touched.surname && <div className="error-input">{errors.surname}</div>}
                            </div>
                        </div>
                        <div className="form-group flex">
                            <div className="me-2 w-full">
                                <label htmlFor="phone">{t('Telefon Numarası')}</label>
                                <Field id="phone" name="phone" type="tel" placeholder={t('Telefon Numarası')} className="form-control" />
                                {errors.phone && touched.phone && <div className="error-input">{errors.phone}</div>}
                            </div>
                            <div className="w-full">
                                <label htmlFor="email">{t('E-posta Adresi')}</label>
                                <Field id="email" name="email" type="email" placeholder={t('E-posta Adresi')} className="form-control" />
                                {errors.email && touched.email && <div className="error-input">{errors.email}</div>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div>
                                <RegionSelect name="region_id"/>
                            </div>
                            {errors.region_id && touched.region_id && <div className="error-input">{errors.region_id}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">{t('Adres')}</label>
                            <Field id="address" name="address" type="text" placeholder={t('Adres')} className="form-control" />
                        </div>
                        <div className="form-group flex w-full">
                            <div className="me-2 w-full">
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

                                {errors.password && touched.password && <div className="error-input">{errors.password}</div>}
                            </div>
                            <div className="w-full">
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
                                {errors.password_confirmation && touched.password_confirmation && <div className="error-input">{errors.password_confirmation}</div>}
                            </div>
                        </div>
                        <div className="my-2">
                            <PasswordStrengthBar className="pass-strength" password={values.password} />
                            <span className="pass-info">
                                {t('Lütfen en az 8 karakter, 1 büyük harf, 1 rakam ve 1 sembol içeren bir şifre giriniz.')}
                            </span>
                        </div>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                        </button>
                        <div className="auth-links">
                            <span>{t('Zaten hesabınız var mı?')}</span>
                            <Link to={ROUTES.AUTH.LOGIN}>
                               &nbsp; {t('Giriş yap')}
                            </Link>
                        </div>
                        <div className="home-links">
                           <Link to={ROUTES.ROOT.DASHBOARD}>{t('Anasayfa Dön')}</Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Register;
