import React, { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useCampaign } from "../../../../../ServerSide/Hooks/useCampaign";
import { useSelector } from "react-redux";
import { useCoupon } from "@/ServerSide/Hooks/useCoupon.jsx";
import CoverImage from "../../../UserPanel/Crud/Misc/CoverImage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CampaignEdit = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const { getCampaigns, updateCampaign } = useCampaign();
    const { setCoupon } = useCoupon();

    const campaign = useSelector(state => state.home.campaign.campaign);
    const isLoading = useSelector(state => state.home.campaign.loading);
    const coupons = useSelector(state => state.coupon.coupons);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getCampaigns(slug),
                    setCoupon()
                ]);
            } catch (error) {
                toast.error(t("Veri çekme hatası oluştu 😢"));
                console.error("Veri çekme hatası:", error);
            }
        };
        fetchData();
    }, [slug]);

    const initialValues = useMemo(() => ({
        title: campaign?.title || "",
        coupons_id: campaign?.coupon?.id || "",
        content: campaign?.content || "",
        long_content: campaign?.long_content || ""
    }), [campaign]);

    const validationSchema = Yup.object({
        title: Yup.string().required(t("Başlık Zorunlu")),
        coupons_id: Yup.string().required(t("Kupon Kodu Zorunlu")),
        content: Yup.string().required(t("İçerik Zorunlu")),
        long_content: Yup.string().required(t("Uzun İçerik Zorunlu"))
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateCampaign(values, slug); // ✅ Güncelleme yapılıyor
            toast.success(t("Kampanya başarıyla güncellendi! 🚀"));

            // ✅ Güncel veriyi tekrar çekiyoruz
            await getCampaigns(slug);

        } catch (error) {
            toast.error(t("Bir hata oluştu, tekrar deneyin ❌"));
            console.error("Güncelleme hatası:", error);
        } finally {
            setSubmitting(false); // 🔁 Form tekrar kullanılabilir olsun
        }
    };


    if (isLoading || !campaign) return null;

    return (
        <div>
            <div className="title">
                <h1>{t('Kampanya Düzenle')}</h1>
                <span className="sub-title">{t('Kampanya Düzenleyin')}</span>
            </div>
            <div className="card">
                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="title">{t('Başlık')} <span className="required">*</span></label>
                                        <Field type="text" name="title" className="w-full"/>
                                        <ErrorMessage name="title" component="span" className="error-input"/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="coupons_id">
                                            {t('Kupon Kodu')} <span className="required">*</span>
                                        </label>
                                        <Field as="select" name="coupons_id" className="w-full">
                                            <option value="">{t('Kupon Seçiniz')}</option>
                                            {coupons?.map((coupon) => (
                                                <option key={coupon.id} value={coupon.id}>
                                                    {coupon.code}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="coupons_id" component="span" className="error-input"/>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="content">{t('İçerik')} <span className="required">*</span></label>
                                    <Field
                                        as="textarea"
                                        name="content"
                                        maxLength="255"
                                        className="w-full"
                                    />
                                    <ErrorMessage name="content" component="span" className="error-input"/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="long_content">{t('Uzun İçerik')} <span className="required">*</span></label>
                                    <Field
                                        as="textarea"
                                        name="long_content"
                                        rows="2"
                                        maxLength="255"
                                        className="w-full"
                                    />
                                    <ErrorMessage name="long_content" component="span" className="error-input"/>
                                </div>

                                <div>
                                    <CoverImage title="Kampanya Fotoğrafı" image={campaign?.image}/>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = "/users";
                                        }}
                                    >
                                        {t('İptal')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? t('Kaydediliyor...') : t('Kaydet')}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CampaignEdit;
