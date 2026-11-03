import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from 'react-i18next';
import { useAttr } from "../../../../../../ServerSide/Hooks/useAttr";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import IconSelect from "./IconSelect";
import { toast } from "react-toastify";

const labelMapping = {
    villa: "villa",
    boat: "boat",
    bungalow: "bungalov"
};

const AttrEdit = () => {
    const { t } = useTranslation();
    const { updateAttr, fetchAttrwSlug } = useAttr();
    const { slug } = useParams();
    const [ newSlug, setNewSlug] = useState(slug);
    const isLoading = useSelector(state => state.attr.loading);
    const [selectedImage, setSelectedImage] = useState(null);
    const [response, setResponse] = useState(null);
    // 📌 İçerik tipleri
    const initialTypes = useMemo(() => [
        { name: t('Tipi'), value: 'category' },
        { name: t('Yakıt'), value: 'operation' },
        { name: t('Kural'), value: 'rules' },
        { name: t('Özellik'), value: 'features' },
        { name: t('Markalar'), value: 'near' },
    ], [t]);

    // 📌 Form verisi geldiğinde initialValues
    const initialValues = useMemo(() => ({
        title: response?.title || "",
        desc: response?.desc || "",
        info: response?.info || "",
        attrType: response?.attr_type || "",
        postType: response?.post_type || [],
        cover: null,
    }), [response]);

    // 📌 Validasyon kuralları
    const validationSchema = useMemo(() => Yup.object({
        title: Yup.string().required(t("Başlık alanı zorunludur.")),
        desc: Yup.string().nullable(),
        info: Yup.string().required(t("İkon seçmek zorunludur.")),
        attrType: Yup.string()
            .oneOf(['features', 'rules', 'category', 'operation', 'near'])
            .required(t("İçerik tipi seçmek zorunludur.")),
        postType: Yup.array()
            .of(Yup.string().oneOf(['villa', 'bungalow', 'boat', 'all']))
            .min(1, t("En az bir mülk tipi seçmelisiniz.")),
    }), [t]);

    // 📌 Submit fonksiyonu
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("desc", values.desc);
            formData.append("info", values.info);
            formData.append("attr_type", values.attrType);
            values.postType.forEach(pt => formData.append("post_type[]", pt));

            if (values.cover && values.attrType === "category") {
                formData.append("cover", values.cover);
            }

            const updateResponse = await updateAttr(newSlug, formData); // ✔️ güncel slug

            setNewSlug(updateResponse?.data?.slug);
            toast.success(t("Başarıyla güncellendi"));
        } catch (error) {
            console.error("Hata oluştu:", error);
            toast.error(t("Bir hata oluştu"));
        } finally {
            setSubmitting(false);
        }
    };

    // 📌 İlk attr verisini çek
    useEffect(() => {
        const fetchAttr = async () => {
            try {
                const res = await fetchAttrwSlug(slug);
                setResponse(res?.data);
                // Eski görseli önizleme olarak ata (eğer varsa)
                if (res.data?.cover?.media_url) {
                    setSelectedImage(res.data.cover.media_url);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAttr();
    }, [slug]);

    // 📌 Dosya seçimi ve preview işlemi
    const handleFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("cover", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };


    // 🛠️ Veriler gelmeden hiçbir şey render etme
    if (!response) {
        return <div className="text-gray-500 text-sm">{t("Yükleniyor...")}</div>;
    }

    return (
        <div className="attr-page">
            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form>
                                <div className="grid lg:grid-cols-12 gap-6">
                                    {values.attrType === "category" && (
                                        <>
                                            {/* Görsel inputu */}
                                            <div className="form-group lg:col-span-3 col-span-12">
                                                <label htmlFor="cover">{t('Görsel')}</label>
                                                <input
                                                    type="file"
                                                    name="cover"
                                                    className="w-full"
                                                    onChange={(event) => handleFileChange(event, setFieldValue)}
                                                />
                                                <ErrorMessage name="cover" component="span" className="error-input" />
                                            </div>

                                            {/* Önizleme */}
                                            <div className="form-group lg:col-span-3 col-span-12">
                                                {selectedImage && (
                                                    <img src={selectedImage} alt="Önizleme" className="w-32 h-32 rounded shadow object-cover" />
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* İkon seçimi (her zaman görünsün) */}
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label htmlFor="info">{t('İkon')} <span className="required">*</span></label>
                                        <IconSelect currentIconClass={response?.info} />
                                    </div>
                                </div>


                                {/* Başlık - açıklama */}
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

                                {/* Tip seçimleri */}
                                <div className="grid lg:grid-cols-12 gap-6 mt-4">
                                    {/* Model tipi */}
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label>{t('Model Tipi')} <span className="required">*</span></label>
                                        <div className="card">
                                            <div className="card-body">
                                                {["villa", "boat", "bungalow"].map((value) => (
                                                    <label key={value} className="custom-select block border px-3 py-2 rounded-md mb-1">
                                                        <Field
                                                            type="checkbox"
                                                            name="postType"
                                                            value={value}
                                                            checked={values.postType.includes(value)}
                                                            className="mr-2"
                                                        />
                                                        {labelMapping[value]}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="postType" component="span" className="error-input" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* İçerik tipi */}
                                    <div className="form-group lg:col-span-6 col-span-12">
                                        <label>{t('İçerik Tipi')} <span className="required">*</span></label>
                                        <div className="card">
                                            <div className="card-body">
                                                {initialTypes.map((type) => (
                                                    <label key={type.value} className="custom-select block border px-3 py-2 rounded-md mb-1">
                                                        <Field
                                                            type="radio"
                                                            name="attrType"
                                                            value={type.value}
                                                            checked={values.attrType === type.value}
                                                            className="mr-2"
                                                        />
                                                        {type.name}
                                                    </label>
                                                ))}
                                                <ErrorMessage name="attrType" component="span" className="error-input" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Butonlar */}
                                <div className="form-actions mt-4">
                                    <button type="button" className="cancel-btn">
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

export default AttrEdit;
