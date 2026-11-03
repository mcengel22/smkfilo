import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFaq } from "../../../../../ServerSide/Hooks/useFaq";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/* ✅ Validation şeması */
const validationSchema = Yup.object({
    question: Yup.string()
        .required("Soru alanı zorunludur."),

    answer: Yup.string()
        .required("Cevap alanı zorunludur."),
    status: Yup.string()
        .oneOf(["active", "passive"], "Geçersiz durum seçimi")
        .required(),
});

const FaqEdit = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { getFaq, updateFaq } = useFaq();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        question: "",
        answer: "",
        status: "active",
    });
    const [loading, setLoading] = useState(true);

    /* 🔹 SSS verisini sadece 1 kere getir */
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const data = await getFaq(id);

                if (!mounted) return;

                if (!data || typeof data !== "object") {
                    toast.error(t("SSS verisi bulunamadı."));
                    navigate(ROUTES.UI.FAQ);
                    return;
                }

                setInitialValues({
                    question: data.question || "",
                    answer: data.answer || "",
                    status: data.status || "active",
                });
            } catch (error) {
                console.error("❌ SSS yükleme hatası:", error);
                toast.error(t("SSS verisi yüklenemedi."));
                navigate(ROUTES.UI.FAQ);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [id]); // ✅ sadece id'ye bağımlı, sonsuz döngü yok

    /* 🔹 Form gönderimi */
    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();
                formData.append("question", values.question);
                formData.append("answer", values.answer);
                formData.append("status", values.status);

                const response = await updateFaq(id, formData);

                if (response?.success) {
                    toast.success(t("SSS başarıyla güncellendi."));
                } else {
                    toast.info(t("SSS güncellendi."));
                }

                navigate(ROUTES.UI.FAQ);
            } catch (error) {
                console.error("❌ SSS güncelleme hatası:", error);
                toast.error(t("SSS güncellenemedi."));
            } finally {
                setSubmitting(false);
            }
        },
        [updateFaq, id, navigate, t]
    );

    /* 🔹 Yükleniyor durumu */
    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">
                {t("Veri yükleniyor...")}
            </div>
        );
    }

    /* 🔹 Form render */
    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t("SSS Düzenle")}</h1>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        {/* Soru */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Soru")}
                            </label>
                            <Field
                                type="text"
                                name="question"
                                placeholder={t("Soru başlığını yazın...")}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            />
                            <ErrorMessage
                                name="question"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Cevap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Cevap")}
                            </label>
                            <Field
                                as="textarea"
                                rows="5"
                                name="answer"
                                placeholder={t("Cevabı yazın...")}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            />
                            <ErrorMessage
                                name="answer"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Durum */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("Durum")}
                            </label>
                            <Field
                                as="select"
                                name="status"
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
                            >
                                <option value="active">{t("Aktif")}</option>
                                <option value="passive">{t("Pasif")}</option>
                            </Field>
                            <ErrorMessage
                                name="status"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Gönder Butonu */}
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
                                {isSubmitting
                                    ? t("Kaydediliyor...")
                                    : t("Güncelle")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FaqEdit;
