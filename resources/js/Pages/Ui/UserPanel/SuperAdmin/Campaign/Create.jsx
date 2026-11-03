import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCampaign } from "@/ServerSide/Hooks/useCampaign.jsx";
import { useCoupon } from "../../../../../ServerSide/Hooks/useCoupon";

const CampaignCreate = () => {
    const { t } = useTranslation();
    const { setCoupon } = useCoupon();
    const dispatch = useDispatch();
    const { createCampaign } = useCampaign();
    const navigate = useNavigate();
    const coupons = useSelector((state) => state.coupon.coupons);

    useEffect(() => {
        const setCoupons = async () => {
            try {
                const data = await setCoupon();
                console.log("📦 Kuponlar:", data);
            } catch (err) {
                console.error(err);
            }
        };
        setCoupons();
    }, []);

    const initialValues = {
        title: "",
        content: "",
        long_content: "",
        image: null,
        coupons_id: "",
        type: "user", // 🔥 Burada default "user" olarak bırakıyoruz
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Başlık Zorunlu"),
        content: Yup.string().required("İçerik Zorunlu"),
        long_content: Yup.string().required("Uzun İçerik Zorunlu"),
        coupons_id: Yup.string().required("Kupon ID Zorunlu"),
        image: Yup.mixed().nullable(),
    });

    return (
        <div>
            <div className="title">
                <h1>{t("Kampanya Oluştur")}</h1>
                <span className="sub-title">{t("Yeni Kampanya Ekleyin")}</span>
            </div>

            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                const formData = new FormData();

                                Object.keys(values).forEach((key) => {
                                    if (key === "image" && values[key]) {
                                        formData.append(key, values[key]);
                                    } else {
                                        formData.append(key, values[key]);
                                    }
                                });

                                await createCampaign(formData);


                                setTimeout(() => {
                                    navigate("/Panel/Kampanyalar");
                                }, 1000);
                            } catch (error) {
                                console.error("Kampanya oluşturulamadı:", error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                {/* Başlık */}
                                <div className="form-group">
                                    <label htmlFor="title">
                                        {t("Başlık")} <span className="required">*</span>
                                    </label>
                                    <Field type="text" name="title" className="w-full" />
                                    <ErrorMessage name="title" component="span" className="error-input" />
                                </div>

                                {/* İçerik */}
                                <div className="form-group">
                                    <label htmlFor="content">
                                        {t("İçerik")} <span className="required">*</span>
                                    </label>
                                    <Field as="textarea" name="content" className="w-full" />
                                    <ErrorMessage name="content" component="span" className="error-input" />
                                </div>

                                {/* Uzun İçerik */}
                                <div className="form-group">
                                    <label htmlFor="long_content">
                                        {t("Uzun İçerik")} <span className="required">*</span>
                                    </label>
                                    <Field as="textarea" name="long_content" className="w-full" rows="3" />
                                    <ErrorMessage name="long_content" component="span" className="error-input" />
                                </div>

                                {/* Kupon Seçimi */}
                                <div className="form-group">
                                    <label htmlFor="coupons_id">
                                        {t("Kupon Kodu")} <span className="required">*</span>
                                    </label>
                                    <Field as="select" name="coupons_id" className="w-full">
                                        <option value="">-- {t("Kupon Seç")} --</option>
                                        {coupons?.map((coupon) => (
                                            <option key={coupon.id} value={coupon.id}>
                                                {coupon.code}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="coupons_id" component="span" className="error-input" />
                                </div>

                                {/* Görsel */}
                                <div className="form-group">
                                    <label htmlFor="image">{t("Görsel")}</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                    />
                                    <ErrorMessage name="image" component="span" className="error-input" />
                                </div>

                                {/* Butonlar */}
                                <div className="form-actions flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        className="cancel-btn bg-gray-300 px-4 py-2 rounded"
                                        onClick={() => navigate("/Panel/Kampanyalar")}
                                    >
                                        {t("İptal")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="save-btn bg-blue-600 text-white px-4 py-2 rounded"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? t("Kaydediliyor...") : t("Kaydet")}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default CampaignCreate;
