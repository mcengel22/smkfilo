import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useUser } from "../../../../../ServerSide/Hooks/useUser";
import { useSelector } from "react-redux";
import RegionSelect from "../../../UserPanel/Crud/Misc/RegionSelect";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { getUser, updateUser } = useUser();
    const user = useSelector((state) => state.user.user);
    const isLoading = useSelector((state) => state.user.loading);

    const [showDealerDates, setShowDealerDates] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const get_users = async (id) => {
            try {
                await getUser(id);
            } catch (error) {
                //
            }
        };

        get_users(id);
    }, [id]);

    useEffect(() => {
        if (user) {
            setShowDealerDates(!!user.is_dealer);
            setStartDate(user.dealer_start_date ? new Date(user.dealer_start_date) : null);
            setEndDate(user.dealer_end_date ? new Date(user.dealer_end_date) : null);
        }
    }, [user]);

    if (isLoading) return false;

    // ✅ INITIAL VALUES
    const initialValues = {
        type: user?.type || "",
        region_id: user?.region_id || "",
        name: user?.name || "",
        surname: user?.surname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        password: "",
        password_confirmation: "",

        // 🔥 BOOLEAN ALANLAR
        is_dealer: !!user?.is_dealer,
        is_commissioned_user: !!user?.is_commissioned_user,
        dealer_start_date: user?.dealer_start_date ? new Date(user.dealer_start_date) : null,
        dealer_end_date: user?.dealer_end_date ? new Date(user.dealer_end_date) : null,
    };

    // ✅ VALIDATION
    const validationSchema = Yup.object({
        type: Yup.string().nullable(),
        region_id: Yup.string().nullable(),
        name: Yup.string().nullable(),
        surname: Yup.string().nullable(),
        email: Yup.string().email("Geçerli bir e-posta girin").nullable(),
        phone: Yup.string().nullable(),
        address: Yup.string().nullable(),
        password: Yup.string().min(8, "En az 8 karakter olmalı").nullable(),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Şifreler uyuşmuyor")
            .nullable(),

        is_dealer: Yup.boolean(),
        is_commissioned_user: Yup.boolean(),
        dealer_start_date: Yup.date().nullable(),
        dealer_end_date: Yup.date().nullable(),
    });

    // ✅ SUBMIT
    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            is_dealer: !!values.is_dealer,
            is_commissioned_user: !!values.is_commissioned_user,
            dealer_start_date: values.dealer_start_date ? values.dealer_start_date.toISOString() : null,
            dealer_end_date: values.dealer_end_date ? values.dealer_end_date.toISOString() : null,
        };

        if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        try {
            await updateUser(payload, id);
            toast.success("User başarıyla kaydedildi 🎉");
        } catch (error) {
            console.error(error);
            toast.error("User kaydedilemedi 🚨");
        }
    };

    return (
        <div>
            <div className="title">
                <h1>{t("Kullanıcı Yönetimi")}</h1>
                <span className="sub-title">{t("Kullanıcı Düzenle")}</span>
            </div>

            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form>
                                {/* <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("Kullanıcı Tipi")}</label>
                                        <Field as="select" name="type" className="w-full">
                                            <option value="super_admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </Field>
                                        <ErrorMessage name="type" component="span" className="error-input" />
                                    </div>
                                </div> */}

                                <div className="form-group">
                                    <RegionSelect
                                        defaultRegion={{
                                            id: user?.region_id || "",
                                            name: user?.region?.name || "",
                                        }}
                                    />
                                </div>

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

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t("Şifre")}</label>
                                        <Field type="password" name="password" className="w-full" />
                                    </div>

                                    <div className="form-group">
                                        <label>{t("Şifre Onayı")}</label>
                                        <Field type="password" name="password_confirmation" className="w-full" />
                                    </div>
                                </div>


                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => (window.location.href = "/users")}
                                    >
                                        {t("İptal")}
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSubmitting}
                                    >
                                        {t("Kaydet")}
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

export default UserEdit;
