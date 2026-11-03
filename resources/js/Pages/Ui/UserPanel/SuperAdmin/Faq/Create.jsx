// /Pages/Ui/UserPanel/SuperAdmin/Faq/FaqAdd.jsx
import React, { useCallback } from "react";
import { useFaq } from "../../../../../ServerSide/Hooks/useFaq";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/* ✅ Validation şeması */
const validationSchema = Yup.object({
    question: Yup.string()
        .required("Soru alanı zorunludur.")
        .min(5, "En az 5 karakter giriniz."),
    answer: Yup.string()
        .required("Cevap alanı zorunludur.")
        .min(10, "En az 10 karakter giriniz."),
    status: Yup.string().oneOf(["active", "passive"], "Geçersiz durum seçimi").required(),
});

const FaqAdd = () => {
    const { t } = useTranslation();
    const { createFaq } = useFaq();
    const navigate = useNavigate();

    const initialValues = {
        question: "",
        answer: "",
        status: "active",
    };

    const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            formData.append("question", values.question);
            formData.append("answer", values.answer);
            formData.append("status", values.status);

            const response = await createFaq(formData);

            if (response?.success) {
                toast.success(t("SSS başarıyla eklendi."));
            } else {
                toast.success(t("SSS başarıyla eklendi.")); // Laravel'de success alanı yoksa fallback
            }

            resetForm();
            navigate(ROUTES.UI.FAQLIST);
        } catch (error) {
            console.error("SSS ekleme hatası:", error);
            toast.error(t("SSS kaydı eklenemedi."));
        } finally {
            setSubmitting(false);
        }
    }, [createFaq, navigate, t]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t("Yeni SSS Ekle")}</h1>

            <Formik
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

export default FaqAdd;
