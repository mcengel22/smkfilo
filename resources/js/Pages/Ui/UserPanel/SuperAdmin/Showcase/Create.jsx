import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import { useShowcase } from "../../../../../ServerSide/Hooks/useShowcase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Showcase = () => {
    const { t } = useTranslation();
    const { createShowcases, setShowcases, deleteShowcases } = useShowcase();
    const showcases = useSelector((state) => state.home.showcase.showcases) || [];
    const [refreshKey, setRefreshKey] = useState(0);

    const initialValues = {
        title: "",
        description: "",
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Başlık alanı zorunludur."),
        description: Yup.string().required("Açıklama alanı zorunludur."),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await createShowcases(values);
            toast.success("Vitrin başarıyla kaydedildi!");
            setRefreshKey(prev => prev + 1);
            resetForm();
        } catch (error) {
            console.error("Vitrin kaydedilemedi:", error);
        }
    };

    useEffect(() => {
        const fetchShowcases = async () => {
            try {
                await setShowcases();
            } catch (err) {
                console.error("Vitrinler çekilemedi 😢", err);
            }
        };

        fetchShowcases();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, iptal et!',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await deleteShowcases(id);
                toast.success('Vitrin başarıyla silindi! 🎉');
                setRefreshKey(prev => prev + 1);
            } catch (error) {
                console.error('Silme işlemi sırasında hata oluştu:', error);
                Swal.fire('Hata!', 'Silme işlemi sırasında bir sorun oluştu.', 'error');
            }
        }
    };

    return (
        <div className="showcase">
            <div className="title">
                <h1>Vitrin Yönetimi</h1>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ resetForm }) => (
                                    <Form>
                                        <div className="form-group mb-2">
                                            <label htmlFor="title">{t('Başlık')} <span className="required">*</span></label>
                                            <Field type="text" name="title" className="w-full" />
                                            <ErrorMessage name="title" component="div" className="error-input" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description" className="block">{t('Açıklama')} <span className="required">*</span></label>
                                            <Field as="textarea" name="description" className="w-full" />
                                            <ErrorMessage name="description" component="div" className="error-input" />
                                        </div>
                                        <div className="form-actions mt-3 flex gap-3">
                                            <button type="button" className="cancel-btn" onClick={() => resetForm()}>
                                                {t('Temizle')}
                                            </button>
                                            <button type="submit" className="save-btn">
                                                <span>{t('Kaydet')}</span>
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label className="block">{t('Vitrin Listesi')}</label>
                            </div>
                            <ul id="showcaseList" className="list-none showcase-list">
                                {Array.isArray(showcases) && showcases.map((showcase, index) => (
                                    <li key={index} className="showcase-item flex justify-between items-center">
                                        <span>{showcase.title}</span>
                                        <div className="actions-btn flex gap-2">
                                            <Link to={ROUTES.UI.SHOWCASEEDIT + "/" + showcase.id}
                                                  className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition">
                                                <i className="icon plus me-1"></i> İlan Ekle
                                            </Link>
                                            <button type="button" title="Sil"
                                                    onClick={() => handleDelete(showcase.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition">
                                                <i className="icon trash"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Showcase;
