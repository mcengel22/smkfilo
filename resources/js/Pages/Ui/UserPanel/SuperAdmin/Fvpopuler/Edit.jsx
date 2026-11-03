import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePopulerregion } from "../../../../../ServerSide/Hooks/usePopulerregion";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import RegionSelect from "@/Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";

/* ✅ Validation */
const validationSchema = Yup.object({
    region_id: Yup.number().required("Bölge seçimi zorunludur."),
    cover: Yup.mixed().nullable(),
});

const FvEdit = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { getPopulerregion, updatePopulerregion } = usePopulerregion();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        region_id: "",
        cover: null,
    });
    const [defaultRegion, setDefaultRegion] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    /* 🔹 Mevcut veriyi getir */
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const data = await getPopulerregion(id);
                if (!mounted) return;

                if (!data || typeof data !== "object") {
                    toast.error(t("Popüler bölge bulunamadı."));
                    navigate(ROUTES.UI.FVREGION);
                    return;
                }

                setInitialValues({
                    region_id: data.region?.id || "",
                    cover: null,
                });

                // RegionSelect için varsayılan değer
                if (data.region) {
                    setDefaultRegion({
                        id: data.region.id,
                        name: data.region.name,
                    });
                }

                setPreview(data.cover?.media_url || null);
            } catch (error) {
                console.error("❌ Yükleme hatası:", error);
                toast.error(t("Popüler bölge yüklenemedi."));
                navigate(ROUTES.UI.FVREGION);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [id]);

    /* 🔹 Form gönderimi */
    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();
                formData.append("region_id", values.region_id);
                if (values.cover) {
                    formData.append("cover", values.cover);
                }

                const response = await updatePopulerregion(id, formData);

                if (response?.success) {
                    toast.success(t("Popüler bölge başarıyla güncellendi."));
                } else {
                    toast.info(t("Popüler bölge güncellendi."));
                }

                // ✅ Güncellemeden sonra liste sayfasına yönlendir
                navigate(ROUTES.UI.FVREGION);
            } catch (error) {
                console.error("❌ Güncelleme hatası:", error);
                toast.error(t("Popüler bölge güncellenemedi."));
            } finally {
                setSubmitting(false);
            }
        },
        [updatePopulerregion, id, navigate, t]
    );

    /* 🔹 Yükleniyor durumu */
    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">
                {t("Veri yükleniyor...")}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t("Popüler Bölge Düzenle")}</h1>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-5">
                        {/* 🔹 Bölge Seçimi (RegionSelect komponenti) */}
                        <div>
                            <RegionSelect defaultRegion={defaultRegion} />
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

                        {/* 🔹 Kaydet Butonu */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded text-white font-medium transition ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {isSubmitting ? t("Kaydediliyor...") : t("Güncelle")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FvEdit;
