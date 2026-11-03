import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';
import { useAttr } from "../../../../../../ServerSide/Hooks/useAttr";
import { toast } from "react-toastify";
import IconSelect from "./IconSelect.jsx";
import { ROUTES } from "../../../../../../Libs/Routes/config"; // ✅ ROUTES import edildi

const AttrCreate = () => {
    const { t } = useTranslation();
    const { createAttr } = useAttr(); // createAttr fonksiyonunu al
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    const initialValues = {
        title: "",
        desc: "",
        cover: null,
        info: "",
        attr_type: "",
        post_type: [],
    };

    const initialTypes = useMemo(() => [
        { name: t('Tipi'), value: 'category' },
        { name: t('Yakıt'), value: 'operation' },
        { name: t('Kural'), value: 'rules' },
        { name: t('Özellik'), value: 'features' },
        { name: t('Markalar'), value: 'near' },
    ], [t]);

    const labelMapping = {
        villa: "villa",
        boat: "boat",
        bungalow: "bungalov"
    };

    // 📏 Yup validation:
    const validationSchema = Yup.object({
        title: Yup.string().required(t("Başlık alanı zorunludur.")),
        desc: Yup.string().nullable(),
        info: Yup.string().required(t("İkon seçmek zorunludur.")),
        attr_type: Yup.string()
            .oneOf(['features', 'rules', 'category', 'operation', 'near'])
            .required(t("İçerik tipi seçmek zorunludur.")),
        post_type: Yup.array()
            .of(Yup.string().oneOf(['villa', 'bungalow', 'boat', 'all']))
            .min(1, t("En az bir mülk tipi seçmelisiniz.")),
    });

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("desc", values.desc || "");
            formData.append("info", values.info);
            formData.append("attr_type", values.attr_type);
            values.post_type.forEach(pt => formData.append("post_type[]", pt));

            if (values.cover && values.attr_type === "category") {
                formData.append("cover", values.cover);
            }

            await createAttr(formData);


            // ✅ ROUTES.UI.CATEGORY kullanılarak yönlendirme yapılıyor
            navigate(ROUTES.UI.CATEGORY);

        } catch (error) {
            console.error("Form kaydedilemedi:", error);
            toast.error("Bir hata oluştu.");
        }
    };

    return (
        <div className="attr-page">
            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form>
                                <div className="grid lg:grid-cols-12 gap-6">
                                    {/* Kapak görseli kısmı */}
                                    {/*{values.attr_type === "category" && (*/}
                                    {/*    <div className="form-group lg:col-span-6 col-span-12">*/}
                                    {/*        <label htmlFor="cover">{t('Görsel')}</label>*/}
                                    {/*        <input*/}
                                    {/*            type="file"*/}
                                    {/*            name="cover"*/}
                                    {/*            className="w-full"*/}
                                    {/*            onChange={(event) => {*/}
                                    {/*                const file = event.currentTarget.files[0];*/}
                                    {/*                setFieldValue("cover", file);*/}

                                    {/*                if (file) {*/}
                                    {/*                    const reader = new FileReader();*/}
                                    {/*                    reader.onloadend = () => {*/}
                                    {/*                        setPreviewImage(reader.result);*/}
                                    {/*                    };*/}
                                    {/*                    reader.readAsDataURL(file);*/}
                                    {/*                } else {*/}
                                    {/*                    setPreviewImage(null);*/}
                                    {/*                }*/}
                                    {/*            }}*/}
                                    {/*        />*/}
                                    {/*        <ErrorMessage name="cover" component="span" className="error-input" />*/}

                                    {/*        {previewImage && (*/}
                                    {/*            <img*/}
                                    {/*                src={previewImage}*/}
                                    {/*                alt="Önizleme"*/}
                                    {/*                className="mt-2 rounded shadow w-32 h-32 object-cover"*/}
                                    {/*            />*/}
                                    {/*        )}*/}
                                    {/*    </div>*/}
                                    {/*)}*/}

                                    {/* İkon Seçimi (Info Alanı) */}
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label htmlFor="info">{t('İkon')} <span className="required">*</span></label>
                                        <IconSelect />
                                    </div>
                                </div>

                                {/* Başlık ve açıklama */}
                                <div className="grid lg:grid-cols-12 gap-6 mt-4">
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label htmlFor="title">{t('Başlık')} <span className="required">*</span></label>
                                        <Field type="text" name="title" className="w-full" />
                                        <ErrorMessage name="title" component="span" className="error-input" />
                                    </div>
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label htmlFor="desc">{t('Açıklama')}</label>
                                        <Field type="text" name="desc" className="w-full" />
                                        <ErrorMessage name="desc" component="span" className="error-input" />
                                    </div>
                                </div>

                                {/* Model Tipi Seçimi */}
                                <div className="grid lg:grid-cols-12 gap-6 mt-4">
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label>{t('Mülk Tipi')} <span className="required">*</span></label>
                                        <div className="card">
                                            <div className="card-body">
                                                {["villa", "boat", "bungalow"].map((value) => (
                                                    <label key={value} className="custom-select cursor-pointer block border px-3 py-2 rounded-md mb-1">
                                                        <Field
                                                            type="checkbox"
                                                            name="post_type"
                                                            value={value}
                                                            className="mr-2"
                                                        />
                                                        {labelMapping[value]}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="post_type" component="span" className="error-input" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* İçerik Tipi Seçimi */}
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label>{t('İçerik Tipi')} <span className="required">*</span></label>
                                        <div className="card">
                                            <div className="card-body">
                                                {initialTypes.map((type) => (
                                                    <label key={type.value} className="custom-select cursor-pointer block border px-3 py-2 rounded-md mb-1">
                                                        <Field
                                                            type="radio"
                                                            name="attr_type"
                                                            value={type.value}
                                                            className="mr-2"
                                                        />
                                                        {type.name}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="attr_type" component="span" className="error-input" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form action butonları */}
                                <div className="form-actions mt-4">
                                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                                        {t('İptal')}
                                    </button>
                                    <button type="submit" className="save-btn" disabled={isSubmitting}>
                                        <span>{t('Kaydet')}</span>
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

export default AttrCreate;
