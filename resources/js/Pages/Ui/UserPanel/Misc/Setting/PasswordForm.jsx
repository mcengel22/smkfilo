import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUser } from "../../../../../ServerSide/Hooks/useUser";

const PasswordForm = () => {
    const { t } = useTranslation();
    const { updatePassword } = useUser(); // 🔥 Hook'tan API fonksiyonu
    const user = useSelector(state => state.auth.user);

    const initialValues = {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    };

    const validationSchema = Yup.object({
        current_password: Yup.string().required(t("Mevcut şifre zorunludur")),
        new_password: Yup.string()
            .required(t("Yeni şifre zorunludur"))
            .min(6, t("Yeni şifre en az 6 karakter olmalıdır")),
        new_password_confirmation: Yup.string()
            .oneOf([Yup.ref("new_password"), null], t("Şifreler eşleşmiyor"))
            .required(t("Yeni şifre tekrar zorunludur")),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await updatePassword(values); // ✅ API'ye gönder
            toast.success(t("Şifre başarıyla güncellendi"));
            resetForm();
        } catch (error) {
            toast.error(t("Şifre güncellenemedi"));
        } finally {
            setSubmitting(false);
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
                    <div className="input-grup mb-3">
                        <label htmlFor="current_password">{t("Mevcut Şifre")}</label>
                        <Field
                            id="current_password"
                            name="current_password"
                            type="password"
                            className={`form-control ${
                                errors.current_password && touched.current_password ? "is-invalid" : ""
                            }`}
                        />
                        {errors.current_password && touched.current_password && (
                            <div className="error-input">{t(errors.current_password)}</div>
                        )}
                    </div>

                    <div className="form-grid">
                        <div className="input-grup mb-3">
                            <label htmlFor="new_password">{t("Yeni Şifre")}</label>
                            <Field
                                id="new_password"
                                name="new_password"
                                type="password"
                                className={`form-control ${
                                    errors.new_password && touched.new_password ? "is-invalid" : ""
                                }`}
                            />
                            {errors.new_password && touched.new_password && (
                                <div className="error-input">{t(errors.new_password)}</div>
                            )}
                        </div>

                        <div className="input-grup">
                            <label htmlFor="new_password_confirmation">{t("Yeni Şifre Tekrar")}</label>
                            <Field
                                id="new_password_confirmation"
                                name="new_password_confirmation"
                                type="password"
                                className={`form-control ${
                                    errors.new_password_confirmation && touched.new_password_confirmation ? "is-invalid" : ""
                                }`}
                            />
                            {errors.new_password_confirmation && touched.new_password_confirmation && (
                                <div className="error-input">{t(errors.new_password_confirmation)}</div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="kaydet-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t("Güncelleniyor...") : t("Şifreyi Değiştir")}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default PasswordForm;
