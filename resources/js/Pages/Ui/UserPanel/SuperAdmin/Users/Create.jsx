import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUser } from "../../../../../ServerSide/Hooks/useUser";
import { toast } from "react-toastify";
import RegionSelect from "../../../../../Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserCreate = () => {
    const { t } = useTranslation();
    const { createUser } = useUser();

    const [showDealerDates, setShowDealerDates] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const initialValues = {
        type: "user",
        region_id: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        password_confirmation: "",

        // 🔥 BOOLEAN ALANLAR
        is_dealer: false,
        is_commissioned_user: false,
        dealer_start_date: null,
        dealer_end_date: null,
    };

    const validationSchema = Yup.object({
        // type: Yup.string().required(t("Zorunlu alan")),
        region_id: Yup.string().nullable(),
        name: Yup.string().required(t("Ad zorunlu")),
        surname: Yup.string().required(t("Soyad zorunlu")),
        email: Yup.string()
            .email(t("Geçerli bir e-posta girin"))
            .required(t("Zorunlu")),
        phone: Yup.string().required(t("Telefon zorunlu")),
        address: Yup.string().nullable(),
        password: Yup.string()
            .min(8, t("En az 8 karakter olmalı"))
            .required(t("Şifre zorunlu")),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password")], t("Şifreler uyuşmuyor"))
            .required(t("Şifre onayı zorunlu")),

        is_dealer: Yup.boolean(),
        is_commissioned_user: Yup.boolean(),
        dealer_start_date: Yup.date().nullable(),
        dealer_end_date: Yup.date().nullable(),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // 🔥 NET BOOLEAN PAYLOAD
            const payload = {
                ...values,
                type: "super_admin", // Otomatik olarak super_admin gönderiliyor
                is_dealer: !!values.is_dealer,
                is_commissioned_user: !!values.is_commissioned_user,
                dealer_start_date: values.dealer_start_date,
                dealer_end_date: values.dealer_end_date,
            };

            await createUser(payload);

            toast.success(t("Kullanıcı başarıyla oluşturuldu"));
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(t("Kullanıcı oluşturulamadı"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="title">
                <h1>{t("Kullanıcı Yönetimi")}</h1>
                <span className="sub-title">{t("Yeni Kullanıcı")}</span>
            </div>

            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form>

                                {/* 👤 Kullanıcı Tipi & Bölge */}
                                <div className="form-row">
                                    {/* Şimdilik Yorum Satırında - Kullanıcı Tipi otomatik super_admin gidecek
                                    <div className="form-group">
                                        <label>{t("Kullanıcı Tipi")}</label>
                                        <Field as="select" name="type" className="w-full">
                                            <option value="super_admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </Field>
                                        <ErrorMessage name="type" component="span" className="error-input" />
                                    </div>
                                    */}

                                    <RegionSelect />
                                </div>

                                {/* 👤 Kişisel Bilgiler */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("Ad")}</label>
                                        <Field type="text" name="name" className="w-full" />
                                        <ErrorMessage name="name" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label>{t("Soyad")}</label>
                                        <Field type="text" name="surname" className="w-full" />
                                        <ErrorMessage name="surname" component="span" className="error-input" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("E-posta")}</label>
                                        <Field type="email" name="email" className="w-full" />
                                        <ErrorMessage name="email" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label>{t("Telefon")}</label>
                                        <Field type="tel" name="phone" className="w-full" />
                                        <ErrorMessage name="phone" component="span" className="error-input" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>{t("Adres")}</label>
                                    <Field as="textarea" name="address" rows="2" className="w-full" />
                                </div>

                                {/* 🔐 Şifre */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("Şifre")}</label>
                                        <Field type="password" name="password" className="w-full" />
                                        <ErrorMessage name="password" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label>{t("Şifre Onayı")}</label>
                                        <Field
                                            type="password"
                                            name="password_confirmation"
                                            className="w-full"
                                        />
                                        <ErrorMessage
                                            name="password_confirmation"
                                            component="span"
                                            className="error-input"
                                        />
                                    </div>
                                </div>

                               

                                {/* 💾 ACTIONS */}
                                <div className="form-actions" style={{ marginTop: 30 }}>
                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Kaydediliyor…" : "Kaydet"}
                                    </button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default UserCreate;
