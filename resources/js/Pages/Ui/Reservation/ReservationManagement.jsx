import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import Header from "../../../Components/UI/Header/Header";
import * as Yup from "yup";
import { useReservation } from "../../../ServerSide/Hooks/useReservation";
import ReservationPreview from "../Reservation/ReservationPreview";

const ReservationManagement = () => {
    const { t } = useTranslation();

    // 🔥 DÜZGÜN FONKSİYONU ÇEK
    const { searchReservation } = useReservation();

    const [reservation, setReservation] = useState(null);

    const initialValues = { number: "", tel: "" };

    // ✅ Validation
    const validationSchema = Yup.object({
        number: Yup.string().required(t("Rezervasyon Numarası zorunludur")),
        tel: Yup.string().required(t("Telefon numarası zorunludur")),
    });

    // 🚀 Form Submit
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await searchReservation({
                code: values.number,
                phone: values.tel,
            });

            if (result) {
                setReservation(result); // ✅ başarılıysa yaz
            } else {
                setReservation(null); // ❌ başarısızsa sıfırla
            }
        } catch (e) {
            setReservation(null); // 🧯 hata varsa yine sıfırla
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="inner-page reservation-management">
            <Header />
            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 mt-4 px-4">
                <div className="mb-8">
                    <h1 className="text-left">
                        {t("Rezervasyon bilgilerinize kolayca ulaşın!")}
                    </h1>
                    <span className="sub-title">
            {t(
                "Rezervasyon detaylarınızı görüntülemek için rezervasyon kodunu ve telefon numaranızı aşağıdaki alana girin."
            )}
          </span>
                </div>

                {/* 🔍 Formik */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="content">
                            <div className="card mb-5">
                                <div className="flex flex-wrap -mx-4 items-center">
                                    <div className="w-full lg:w-1/3 px-4">
                                        <div className="input-group">
                                            <Field
                                                id="reservationCode"
                                                name="number"
                                                type="text"
                                                placeholder={t("Rezervasyon Numarası")}
                                                className="form-control"
                                            />
                                            {errors.number && touched.number && (
                                                <div className="error-input">{errors.number}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/3 px-4">
                                        <div className="input-group">
                                            <Field
                                                id="phoneNumber"
                                                name="tel"
                                                type="tel"
                                                placeholder={t("Telefon Numarası")}
                                                className="form-control"
                                            />
                                            {errors.tel && touched.tel && (
                                                <div className="error-input">{errors.tel}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/3 px-4 mb-5">
                                        <button
                                            type="submit"
                                            className="submit-button btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {t("Rezervasyonumu Göster")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

                {/* 🎯 API sonucu varsa göster */}
                {reservation && (
                    <div className="mt-6">
                        <ReservationPreview data={reservation} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationManagement;
