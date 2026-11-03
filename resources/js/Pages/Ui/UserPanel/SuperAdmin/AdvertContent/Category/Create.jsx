import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../../../Components/UI/Header/Header";
import { useTranslation } from 'react-i18next';
import Aside from "../../../Aside";
import AttrCreate from "../Misc/Create";

const TypeCreate = () => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        name: Yup.string().required("Tip Adı Zorunlu"),
        type: Yup.string().required("Kategori Zorunlu"),
    });

    return (
        <div>
            <div className="title">
                <h1>{t('Tipler Yönetimi')}</h1>
                <span className="sub-title">{t('Yeni Tip')}</span>
            </div>
            {/* <div className="card">
                            <div className="card-body">
                                <Formik
                                    initialValues={{
                                        checkbox: false,
                                        checkbox1: false,
                                        checkbox2: false,
                                    }}
                                    onSubmit={(values) => {
                                        console.log(values);
                                    }}
                                    validationSchema={validationSchema}>
                                    {({ isSubmitting, setFieldValue, values }) => (
                                        <Form>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="file">{t('Görsel')} <span className="required">*</span></label>
                                                    <input type="file" name="file" rows="2" className="w-full" />
                                                    <ErrorMessage name="file" component="span" className="error-input" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="type">{t('İkon')} <span className="required">*</span></label>
                                                    <Field as="select" name="type" className="w-full">
                                                        <option value="select_category">{t('Kategori Seçin')}</option>
                                                        <option value="special">{t('Özel')}</option>
                                                        <option value="gift">{t('Hediye')}</option>
                                                    </Field>
                                                    <ErrorMessage name="type" component="span" className="error-input" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">{t('Tip Adı')} <span className="required">*</span></label>
                                                    <Field type="name" name="name" maxLength="255" className="w-full" />
                                                    <ErrorMessage name="name" component="span" className="error-input" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>{t('Model')} <span className="required">*</span></label>
                                                <div className="card w-full md:w-1/2 mb-2 pl-2">
                                                    <div className="card-body">
                                                        <div className="gap-4">
                                                            <div className="form-check">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="villa"
                                                                    id="villa"
                                                                    checked={values.villa}
                                                                    onChange={() => setFieldValue("villa", !values.villa)}
                                                                />
                                                                <label htmlFor="villa" className="form-check-label">{t('Villa')} </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="yat"
                                                                    id="yat"
                                                                    checked={values.yat}
                                                                    onChange={() => setFieldValue("yat", !values.yat)}
                                                                />
                                                                <label htmlFor="yat" className="form-check-label">{t('Yat')} </label>
                                                            </div>
                                                            <div className="form-check">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="bungalov"
                                                                    id="bungalov"
                                                                    checked={values.bungalov}
                                                                    onChange={() => setFieldValue("bungalov", !values.bungalov)}
                                                                />
                                                                 <label htmlFor="bungalov" className="form-check-label">{t('Bungalov')} </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-actions">
                                                <button type="button" className="cancel-btn">
                                                    {t('İptal')}
                                                </button>
                                                <button type="submit" className="save-btn">
                                                    <span>{t('Kaydet')}</span>
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div> */}
            <AttrCreate />
        </div>
    );
};

export default TypeCreate;
