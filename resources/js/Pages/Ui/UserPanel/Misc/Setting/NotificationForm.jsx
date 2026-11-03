import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
const NotificationForm = () => {
    const { t } = useTranslation();
    const initialValues = {
        email_permission: false,
        sms_permission: false,
    };

    return (
        <Formik
            initialValues={initialValues}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className="bildirim-secenekleri">
                        <label className="toggle-switch">
                            <Field type="checkbox" name="email_permission" />
                            <span className="switch"></span>
                            <span>{t('E-posta Bildirimleri')}</span>
                        </label>

                        <label className="toggle-switch">
                            <Field type="checkbox" name="sms_permission" />
                            <span className="switch"></span>
                            <span>{t('SMS Bildirimleri')}</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="kaydet-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? t('Güncelleniyor...')
                            : t('Bildirimleri Güncelle')}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default NotificationForm;
