import React, { useState, useEffect } from "react";
import Header from "../../../Components/UI/Header/Header";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { usePayment } from "../../../ServerSide/Hooks/usePayment";
import { useReservation } from "../../../ServerSide/Hooks/useReservation";

// ✅ Eksik importlar eklendi
import {
    resetPaymentState,
    setCardInfo,
} from "../../../Repo/Redux/Modules/PaymentSlice";
import { clearReservation } from "../../../Repo/Redux/Modules/ReservationSlice";

const Payment = () => {
    const { t } = useTranslation();
    const payment = useSelector((state) => state.payment);
    const { createReservation } = useReservation();
    const { createPayment } = usePayment();
    const dispatch = useDispatch();

    // ✅ Sadece error/loading/success durumlarını resetliyoruz
    useEffect(() => {
        if (payment.loading || payment.error || payment.success) {
            dispatch(resetPaymentState());
        }
    }, [dispatch, payment.loading, payment.error, payment.success]);

    const handleInputChange = (field, value, setFieldValue) => {
        setFieldValue(field, value);

        // ✅ Kart bilgilerini Redux’a yaz (memoize şekilde)
        const cardFields = ["cardHolderName", "cardNumber", "expiry", "cvc"];

        if (cardFields.includes(field)) {
            dispatch(
                setCardInfo({
                    cardHolderName:
                        field === "cardHolderName"
                            ? value
                            : payment.cardHolderName,
                    cardNumber:
                        field === "cardNumber" ? value : payment.cardNumber,
                    expiry: field === "expiry" ? value : payment.expiry,
                    cvc: field === "cvc" ? value : payment.cvc,
                }),
            );
        }
    };

    const initialValues = {
        cardHolderName: payment.cardHolderName || "",
        cardNumber: payment.cardNumber || "",
        expiry: payment.expiry || "",
        cvc: payment.cvc || "",
    };

    const validationSchema = Yup.object({
        cardHolderName: Yup.string().required(
            "Kart üzerindeki isim zorunludur",
        ),
        cardNumber: Yup.string()
            .matches(
                /^\d{4} \d{4} \d{4} \d{4}$/,
                "Geçerli bir kart numarası giriniz (0000 0000 0000 0000)",
            )
            .required("Kart numarası zorunludur"),
        expiry: Yup.string()
            .matches(
                /^(0[1-9]|1[0-2])\/\d{2}$/,
                "Geçerli bir tarih giriniz (AA/YY)",
            )
            .required("Son kullanma tarihi zorunludur"),
        cvc: Yup.string()
            .matches(/^\d{3}$/, "Geçerli bir CVV giriniz")
            .required("CVV zorunludur"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // ✅ Form + Redux birleşimi
            const paymentData = {
                reservationId: payment.reservationId,
                title: payment.title,
                paymentMethod: payment.paymentMethod,
                paymentOption: payment.paymentOption,
                amount: payment.amount,
                selectedDates: payment.selectedDates,
                cardHolderName: values.cardHolderName,
                cardNumber: values.cardNumber,
                expiry: values.expiry,
                cvc: values.cvc,
            };

            // ✅ Ödemeyi gönder
            await createPayment(paymentData);

            // ✅ Redux state’leri temizle
            dispatch(resetPaymentState());
            dispatch(clearReservation());

            // ✅ Form sıfırla
            setSubmitting(false);
            resetForm();
        } catch (error) {
            console.error("Payment processing error:", error);
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="payment-page">
                <div className="container">
                    <div className="payment-content">
                        <div className="payment-header">
                            <h1>{t("Ödeme")}</h1>
                            <div className="reservation-summary bg-gray-100">
                                <div className="villa-info">
                                    <h2>{payment?.title || "Villa"}</h2>
                                    <p>
                                        {payment.selectedDates?.start &&
                                            new Date(
                                                payment.selectedDates.start,
                                            ).toLocaleDateString("tr-TR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}{" "}
                                        -{" "}
                                        {payment.selectedDates?.end &&
                                            new Date(
                                                payment.selectedDates.end,
                                            ).toLocaleDateString("tr-TR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                    </p>
                                </div>
                                <div className="price-info">
                                    <span>{t("Toplam Tutar")}</span>
                                    <strong>
                                        ₺{" "}
                                        {payment.amount?.toLocaleString(
                                            "tr-TR",
                                        ) || "0,00"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({
                                errors,
                                touched,
                                isSubmitting,
                                setFieldValue,
                                values,
                            }) => (
                                <Form className="payment-form">
                                    <div className="form-group">
                                        <label>
                                            {t("Kart Üzerindeki İsim")}
                                        </label>
                                        <Field
                                            name="cardHolderName"
                                            placeholder={t("Ad Soyad")}
                                            className={`form-control ${errors.cardHolderName && touched.cardHolderName ? "is-invalid" : ""}`}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "cardHolderName",
                                                    e.target.value,
                                                    setFieldValue,
                                                )
                                            }
                                        />
                                        {errors.cardHolderName &&
                                            touched.cardHolderName && (
                                                <div className="error-input">
                                                    {errors.cardHolderName}
                                                </div>
                                            )}
                                    </div>

                                    {/* ✅ Kart Numarası */}
                                    <div className="form-group">
                                        <label>{t("Kart Numarası")}</label>
                                        <Field
                                            name="cardNumber"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                            value={values.cardNumber}
                                            className={`form-control ${errors.cardNumber && touched.cardNumber ? "is-invalid" : ""}`}
                                            onChange={(e) => {
                                                let value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    );
                                                value = value
                                                    .replace(/(.{4})/g, "$1 ")
                                                    .trim();
                                                handleInputChange(
                                                    "cardNumber",
                                                    value,
                                                    setFieldValue,
                                                );
                                            }}
                                        />
                                        {errors.cardNumber &&
                                            touched.cardNumber && (
                                                <div className="error-input">
                                                    {errors.cardNumber}
                                                </div>
                                            )}
                                    </div>

                                    <div className="form-row">
                                        {/* ✅ Son Kullanma Tarihi */}
                                        <div className="form-group">
                                            <label>
                                                {t("Son Kullanma Tarihi")}
                                            </label>
                                            <Field
                                                name="expiry"
                                                placeholder="AA/YY"
                                                maxLength="5"
                                                value={values.expiry}
                                                className={`form-control ${errors.expiry && touched.expiry ? "is-invalid" : ""}`}
                                                onChange={(e) => {
                                                    let value =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            "",
                                                        );
                                                    if (value.length > 2) {
                                                        value =
                                                            value.slice(0, 2) +
                                                            "/" +
                                                            value.slice(2, 4);
                                                    }
                                                    handleInputChange(
                                                        "expiry",
                                                        value,
                                                        setFieldValue,
                                                    );
                                                }}
                                            />
                                            {errors.expiry &&
                                                touched.expiry && (
                                                    <div className="error-input">
                                                        {errors.expiry}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="form-group">
                                            <label>{t("CVV")}</label>
                                            <Field
                                                name="cvc"
                                                placeholder="000"
                                                maxLength="3"
                                                className={`form-control ${errors.cvc && touched.cvc ? "is-invalid" : ""}`}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "cvc",
                                                        e.target.value,
                                                        setFieldValue,
                                                    )
                                                }
                                            />
                                            {errors.cvc && touched.cvc && (
                                                <div className="error-input">
                                                    {errors.cvc}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="submit-button bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full mt-4"
                                    >
                                        {isSubmitting
                                            ? "İşlem Yapılıyor..."
                                            : "Ödemeye Git"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
