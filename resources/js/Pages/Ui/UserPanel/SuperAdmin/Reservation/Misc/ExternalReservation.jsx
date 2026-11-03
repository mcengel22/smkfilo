import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";

const ExternalForm = ({ onSave, onClose, selectedDates}) => {
    const { t } = useTranslation();

    const initialValues = {
        note: 'Dış Rezervasyon',
        admin_note: 'Dış Rezervasyon'
    };

    const validationSchema = Yup.object({
        note: Yup.string().required(t('Not alanı zorunlu.'))
    });

    console.log(selectedDates);
    const handleSubmit = async (values) => {
        const result = await onSave(values);
        if (result) {
            onClose();
        }
    };

    return (
        <div>
            <div style={{ textAlign: "right" }}>
                <button
                    onClick={onClose}
                    style={{ background: "none", border: "none", fontSize: "24px" }}
                >
                    &times;
                </button>
            </div>

            <h5 className="text-center mb-2 font-semibold">{t('Harici Rezervasyon')}</h5>

            {/* 🔥 Tarih Bilgisi Göster */}
            <div className="text-center text-sm font-semibold text-gray-700 mb-4">
                📅 {t('Seçilen Tarihler')}:{" "}
                <span className="text-blue-600">
                    {selectedDates.startDate}
                </span>{" "}
                            -{" "}
                <span className="text-blue-600">
                    {selectedDates.endDate}
                </span>
            </div>


            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group mb-2">
                            <label htmlFor="note">{t('Not')} <span className="required">*</span></label>
                            <Field type="text" name="note" className="w-full" />
                            <ErrorMessage name="note" component="div" className="error-input" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="admin_note">{t('Yönetici Notu')}</label>
                            <Field as="textarea" name="admin_note" className="w-full" />
                        </div>

                        <div style={{ marginTop: "10px" }}>
                            <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
                                {isSubmitting ? t('Kaydediliyor...') : t('Kaydet')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ExternalForm;
