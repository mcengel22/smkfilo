import React, { useEffect, useState, useCallback } from "react";
import { useKmPaketleri } from "../../../../../ServerSide/Hooks/useKmPaketleri";
import { useNavigate, useParams } from "react-router-dom";
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

const KmPackagesEdit = () => {
    const { t } = useTranslation();
    const { getKmPackage, editKmPackage } = useKmPaketleri();
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await getKmPackage(id);
                if (response?.success) {
                    setInitialValues({
                        km: response.data.km,
                        price: response.data.price,
                    });
                }
            } catch (error) {
                console.error("Km paketi yükleme hatası:", error);
                toast.error(t("Km paketi bilgileri yüklenemedi."));
            }
        };
        fetchPackage();
    }, [id, getKmPackage, t]);

    const handleSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            const response = await editKmPackage(id, values);

            if (response?.success) {
                toast.success(t("Km paketi başarıyla güncellendi."));
                navigate(ROUTES.UI.KM_PACKAGES);
            }
        } catch (error) {
            console.error("Km paketi güncelleme hatası:", error);
            toast.error(t("Km paketi güncellenemedi."));
        } finally {
            setSubmitting(false);
        }
    }, [id, editKmPackage, navigate, t]);

    if (!initialValues) {
        return <div className="p-6 text-center">{t("Yükleniyor...")}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
            <h1 className="text-2xl font-bold mb-6">{t("Km Paketini Düzenle")}</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
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
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                {isSubmitting ? t("Güncelleniyor...") : t("Güncelle")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default KmPackagesEdit;
