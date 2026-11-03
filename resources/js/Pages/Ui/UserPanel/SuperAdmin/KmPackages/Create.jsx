import React, { useCallback } from "react";
import { useKmPaketleri } from "../../../../../ServerSide/Hooks/useKmPaketleri";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    km: Yup.number()
        .required("Km alanı zorunludur.")
        .min(0, "Km en az 0 olmalıdır."),
    price: Yup.number()
        .required("Fiyat alanı zorunludur.")
        .min(0, "Fiyat en az 0 olmalıdır."),
});

const KmPackagesAdd = () => {
    const { t } = useTranslation();
    const { createKmPackage } = useKmPaketleri();
    const navigate = useNavigate();

    const initialValues = {
        km: "",
        price: "",
    };

    const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await createKmPackage(values);

            if (response?.success) {
                toast.success(t("Km paketi başarıyla eklendi."));
                resetForm();
                navigate(ROUTES.UI.KM_PACKAGES);
            }
        } catch (error) {
            console.error("Km paketi ekleme hatası:", error);
            toast.error(t("Km paketi eklenemedi."));
        } finally {
            setSubmitting(false);
        }
    }, [createKmPackage, navigate, t]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
            <h1 className="text-2xl font-bold mb-6">{t("Yeni Km Paketi Ekle")}</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        {/* Km */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Kilometre")}
                            </label>
                            <Field
                                type="number"
                                name="km"
                                placeholder={t("Km değerini girin...")}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            />
                            <ErrorMessage
                                name="km"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Fiyat */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Fiyat")}
                            </label>
                            <Field
                                type="number"
                                name="price"
                                placeholder={t("Fiyat değerini girin...")}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            />
                            <ErrorMessage
                                name="price"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Gönder */}
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

export default KmPackagesAdd;
