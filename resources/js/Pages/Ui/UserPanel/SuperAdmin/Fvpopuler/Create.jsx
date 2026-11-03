import React, { useCallback, useState } from "react";
import { usePopulerregion } from "../../../../../ServerSide/Hooks/usePopulerregion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import RegionSelect from "@/Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";

/* ✅ Validation şeması */
const validationSchema = Yup.object({
    region_id: Yup.number().required("Bölge seçimi zorunludur."),
    cover: Yup.mixed().nullable(),
});

const FvCreate = () => {
    const { t } = useTranslation();
    const { createPopulerregion } = usePopulerregion();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);

    const initialValues = {
        region_id: "",
        cover: null,
    };

    const handleSubmit = useCallback(
        async (values, { setSubmitting, resetForm }) => {
            try {
                const formData = new FormData();
                formData.append("region_id", values.region_id);
                if (values.cover) {
                    formData.append("cover", values.cover);
                }

                const response = await createPopulerregion(formData);

                if (response?.success) {
                    toast.success(t("Popüler bölge başarıyla eklendi."));
                } else {
                    toast.success(t("Popüler bölge eklendi."));
                }

                resetForm();
                // ✅ Eklemeden sonra liste sayfasına yönlendir
                navigate(ROUTES.UI.FVREGION);
            } catch (error) {
                console.error("❌ Ekleme hatası:", error);
                toast.error(t("Popüler bölge eklenemedi."));
            } finally {
                setSubmitting(false);
            }
        },
        [createPopulerregion, navigate, t]
    );

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t("Yeni Popüler Bölge Ekle")}</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-5">
                        {/* 🔹 Bölge Seçimi (RegionSelect komponenti) */}
                        <div>
                            <RegionSelect />
                            <ErrorMessage
                                name="region_id"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* 🔹 Kapak Görseli (opsiyonel) */}
                        {/*
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Kapak Görseli (opsiyonel)")}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFieldValue("cover", file);
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setPreview(reader.result);
                                        reader.readAsDataURL(file);
                                    } else {
                                        setPreview(null);
                                    }
                                }}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-2 w-32 h-24 object-cover rounded border"
                                />
                            )}
                            <ErrorMessage
                                name="cover"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>
                        */}

                        {/* 🔹 Gönder Butonu */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded text-white font-medium ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isSubmitting ? t("Kaydediliyor...") : t("Kaydet")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FvCreate;
