import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import ReactStars from "react-stars";
import { useComment } from "../../../../../ServerSide/Hooks/useComment";
import { toast } from "react-toastify";

// Giriş kontrolü için örnek bir token kontrolü yapalım
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

const CommentForm = () => {
    const { t } = useTranslation();
    const { createComment } = useComment();

    if (!isAuthenticated()) {
        return (
            <div className="text-center text-red-600 font-semibold p-4">
                🔒 {t("Yorum yapabilmek için giriş yapmalısınız.")}
                <div className="mt-4">
                    <Link
                        to={ROUTES.AUTH.LOGIN}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Giriş Yap
                    </Link>
                </div>
            </div>
        );
    }

    const initialValues = {
        reservation_code: "",
        comment: "",
        rating: 0,
    };

    const validationSchema = Yup.object({
        reservation_code: Yup.string()
            .required(t("Rezervasyon numarası zorunludur.")),
        comment: Yup.string()
            .required(t("Yorum alanı boş bırakılamaz.")),
        rating: Yup.number()
            .min(1, t("Lütfen en az 1 yıldız verin."))
            .required(t("Yıldız derecelendirmesini seçin.")),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            await createComment(values);

            toast.success(t("Yorumunuz başarıyla gönderildi!"), {
                position: "top-center",
                autoClose: 2000,
            });

            resetForm();
        } catch (error) {
            const apiError =
                error?.response?.data?.errors?.error ||
                error?.response?.data?.message ||
                t("Bir hata oluştu.");

            toast.error(apiError, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                    <div>
                        <ReactStars
                            count={5}
                            value={values.rating}
                            onChange={(newRating) => {
                                const full = Math.round(newRating); // 🔥 YARIM SEÇİMİ ENGELLER
                                setFieldValue("rating", full);
                            }}
                            size={32}
                            isHalf={false}          // 🔥 Yarım yıldız tamamen kapalı
                            color2="#fcaf3d"
                        />

                        <ErrorMessage
                            name="rating"
                            component="div"
                            className="error-input"
                        />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-2 md:grid-cols-12 mb-3">
                        <div>
                            <Field
                                name="reservation_code"
                                type="text"
                                placeholder={t("Rezervasyon numarası")}
                                className="w-full border border-gray-300 rounded p-2 mt-1 text-sm font-semibold"
                            />
                            <ErrorMessage
                                name="reservation_code"
                                component="div"
                                className="error-input"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <Field
                            as="textarea"
                            name="comment"
                            placeholder={t("Yorumunuz")}
                            className="w-full border border-gray-300 rounded p-2 mt-1 text-sm font-semibold"
                        />
                        <ErrorMessage
                            name="comment"
                            component="div"
                            className="error-input"
                        />
                    </div>

                    <div className="flex justify-center text-center">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? t("Gönderiliyor...") : t("Gönder")}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CommentForm;
