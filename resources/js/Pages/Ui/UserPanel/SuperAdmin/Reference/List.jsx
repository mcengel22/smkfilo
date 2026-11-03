import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useReference } from "@/ServerSide/Hooks/useReference.jsx";

const emptyValues = {
    name: "",
    link: "",
    sort_order: 0,
    is_active: true,
    logo: null,
};

const ReferenceList = () => {
    const { t } = useTranslation();
    const { references, loading, fetchReferences, saveReference, deleteReference } = useReference();

    // Düzenlenen kayıt; null ise yeni kayıt ekleniyor
    const [editing, setEditing] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchReferences(true);
    }, [fetchReferences]);

    const initialValues = editing
        ? {
              name: editing.name || "",
              link: editing.link || "",
              sort_order: editing.sort_order ?? 0,
              is_active: !!editing.is_active,
              logo: null,
          }
        : emptyValues;

    const validationSchema = Yup.object({
        name: Yup.string().required(t("Firma adı zorunludur")),
        link: Yup.string().url(t("Geçerli bir web adresi girin (https:// ile)")).nullable(),
        sort_order: Yup.number().min(0).integer(),
        logo: editing ? Yup.mixed().nullable() : Yup.mixed().required(t("Logo zorunludur")),
    });

    const resetForm = () => {
        setEditing(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const buildFormData = (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("link", values.link || "");
        formData.append("sort_order", values.sort_order || 0);
        formData.append("is_active", values.is_active ? "1" : "0");
        if (values.logo) formData.append("logo", values.logo);
        return formData;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await saveReference(buildFormData(values), editing?.id);
            resetForm();
            await fetchReferences(true);
        } catch (error) {
            // Hata mesajı hook içinde gösteriliyor
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (reference) => {
        setEditing(reference);
        setPreview(reference.logo);
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleActive = async (reference) => {
        try {
            await saveReference(buildFormData({ ...reference, is_active: !reference.is_active, logo: null }), reference.id);
            await fetchReferences(true);
        } catch (error) {
            // Hata mesajı hook içinde gösteriliyor
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t("Emin misiniz?"),
            text: t("Bu işlem geri alınamaz!"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("Evet, sil!"),
            cancelButtonText: t("Hayır, iptal et!"),
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deleteReference(id);
                if (editing?.id === id) resetForm();
                await fetchReferences(true);
            } catch (error) {
                // Hata mesajı hook içinde gösteriliyor
            }
        }
    };

    return (
        <div>
            <div className="title">
                <h1>{t("Referanslar")}</h1>
                <span className="sub-title">
                    {t("Anasayfadaki kayan referans logolarını buradan yönetebilirsiniz")}
                </span>
            </div>

            <div className="card">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">
                        {editing ? t("Referansı Düzenle") : t("Yeni Referans Ekle")}
                    </h3>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            {t("Firma Adı")} <span className="required">*</span>
                                        </label>
                                        <Field type="text" name="name" className="w-full" />
                                        <ErrorMessage name="name" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="link">{t("Web Sitesi (opsiyonel)")}</label>
                                        <Field type="text" name="link" className="w-full" placeholder="https://" />
                                        <ErrorMessage name="link" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="sort_order">{t("Sıra")}</label>
                                        <Field type="number" name="sort_order" min="0" className="w-full" />
                                        <ErrorMessage name="sort_order" component="span" className="error-input" />
                                    </div>

                                    <div className="form-group">
                                        <label className="flex items-center gap-2 mt-7 cursor-pointer">
                                            <Field type="checkbox" name="is_active" />
                                            {t("Anasayfada göster")}
                                        </label>
                                    </div>

                                    <div className="form-group md:col-span-2">
                                        <label htmlFor="logo">
                                            {t("Logo")} {!editing && <span className="required">*</span>}
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="logo"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue("logo", file || null);
                                                setPreview(file ? URL.createObjectURL(file) : editing?.logo || null);
                                            }}
                                        />
                                        <small className="block text-gray-500 mt-1">
                                            {t("PNG, JPG veya WEBP, en fazla 4 MB. Şeffaf arka planlı PNG önerilir.")}
                                            {editing && " " + t("Değiştirmek istemiyorsanız boş bırakın.")}
                                        </small>
                                        <ErrorMessage name="logo" component="span" className="error-input" />
                                        {preview && (
                                            <div className="reference-admin-preview mt-3">
                                                <img src={preview} alt={values.name} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-actions flex gap-3 mt-4">
                                    {editing && (
                                        <button
                                            type="button"
                                            className="cancel-btn bg-gray-300 px-4 py-2 rounded"
                                            onClick={resetForm}
                                        >
                                            {t("İptal")}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="save-btn bg-blue-600 text-white px-4 py-2 rounded"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? t("Kaydediliyor...")
                                            : editing
                                              ? t("Güncelle")
                                              : t("Ekle")}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            <div className="card mt-6">
                <div className="card-body">
                    <div className="users-content">
                        <div className="table-responsive table-area">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("Logo")}</th>
                                        <th>{t("Firma Adı")}</th>
                                        <th>{t("Web Sitesi")}</th>
                                        <th>{t("Sıra")}</th>
                                        <th>{t("Durum")}</th>
                                        <th>{t("İşlemler")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && references.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-gray-500">
                                                {t("Yükleniyor...")}
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && references.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-gray-500">
                                                {t("Henüz referans eklenmedi.")}
                                            </td>
                                        </tr>
                                    )}
                                    {references.map((reference) => (
                                        <tr key={reference.id}>
                                            <td>
                                                <div className="reference-admin-thumb">
                                                    {reference.logo && <img src={reference.logo} alt={reference.name} />}
                                                </div>
                                            </td>
                                            <td>{reference.name}</td>
                                            <td>
                                                {reference.link ? (
                                                    <a href={reference.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                        {reference.link}
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>{reference.sort_order}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleActive(reference)}
                                                    className={`px-3 py-1 rounded text-sm font-semibold ${
                                                        reference.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                                    title={t("Durumu değiştir")}
                                                >
                                                    {reference.is_active ? t("Aktif") : t("Pasif")}
                                                </button>
                                            </td>
                                            <td className="actions">
                                                <div className="flex">
                                                    <button className="btn-icon" title={t("Düzenle")} onClick={() => handleEdit(reference)}>
                                                        <i className="icon edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        title={t("Sil")}
                                                        onClick={() => handleDelete(reference.id)}
                                                    >
                                                        <i className="icon trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferenceList;
