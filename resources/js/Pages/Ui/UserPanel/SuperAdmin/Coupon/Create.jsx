import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import * as Yup from "yup";
import { useCoupon } from "../../../../../ServerSide/Hooks/useCoupon";

import {useSelector} from "react-redux";
import Swal from "sweetalert2";

const Coupon = () => {
    const { t } = useTranslation();
    const { createCoupon, setCoupon } = useCoupon();  // Hook
    const coupons =useSelector(state => state.coupon.coupons);
    const {deleteCoupon} = useCoupon();
    // 🎯 Form başlangıç değerleri
    const initialValues = {
        code: "",
        type: "percentage",
        discount_value: "",
        min_order_value: "",
        usage_limit_value: "",
        start_date: "",
        end_date: "",
        is_first_order_only: false,
    };

    // ✅ Form doğrulama şeması
    const validationSchema = Yup.object({
        code: Yup.string().required("Kupon kodu zorunludur."),
        type: Yup.string().required("Kupon türü zorunludur."),
        discount_value: Yup.string().required("İndirim değeri zorunludur."),
        min_order_value: Yup.string().required("Minimum sipariş değeri zorunludur."),
        usage_limit_value: Yup.string().required("Kullanım sınır değeri zorunludur."),
        start_date: Yup.date()
            .required("Başlangıç tarihi zorunludur.")
            .min(new Date().toISOString().split("T")[0], "Başlangıç tarihi bugünden önce olamaz."),
        end_date: Yup.date()
            .required("Bitiş tarihi zorunludur.")
            .min(Yup.ref("start_date"), "Bitiş tarihi başlangıçtan önce olamaz."),
        is_first_order_only: Yup.boolean().required("İlk sipariş alanı zorunludur."),
    });

    // 🔥 Form submit işlemi
// 🔥 Form submit işlemi
    const handleSubmit = async (values) => {
        try {
            const response = await createCoupon(values);

            await setCoupon(); // ✅ Yeni kupon ekledikten sonra listeyi güncelle
        } catch (error) {
        }
    };


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, iptal et!',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Silme işlemine başla
                await deleteCoupon(id);


                // Silme işlemi sonrası özellikleri tekrar çek
                await setCoupon(); // Silme sonrası veriyi tekrar çek
            } catch (error) {
                Swal.fire('Hata!', 'Silme işlemi sırasında bir sorun oluştu.', 'error');
            }
        } else {
            console.log('Silme işlemi iptal edildi.');
        }
    };

    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const couponsData = await setCoupon();  // Kuponları al
                setCoupon(couponsData); // Kuponları state'e kaydet
            } catch (error) {

            }
        };

        loadCoupons(); // Component yüklendikten sonra kuponları çek
    }, []); // Bu bağımlılık array'ini boş bırakıyoruz, sadece ilk render'da çalışacak

    return (
        <div className="coupone">
            <div className="title">
                <h1>Kupon Yönetimi</h1>
            </div>
            <div className="flex flex-wrap">
                {/* 🧾 Kupon Formu */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form>
                                        {/* Kupon Kodu */}
                                        <div className="form-group mb-2">
                                            <label htmlFor="code">{t('Kupon Kodu')} <span className="required">*</span></label>
                                            <Field type="text" name="code" className="w-full"/>
                                            <ErrorMessage name="code" component="div" className="error-input"/>
                                        </div>

                                        {/* Kupon Türü & İndirim Değeri */}
                                        <div className="grid lg:grid-cols-12 gap-2 mb-2">
                                            <div className="form-group col-span-6">
                                                <label htmlFor="type">{t('Kupon Türü')} *</label>
                                                <Field as="select" name="type" className="w-full">
                                                    <option value="percentage">{t('Yüzdelik')}</option>
                                                    <option value="fixed">{t('Sabit Tutar')}</option>
                                                </Field>
                                                <ErrorMessage name="type" component="div" className="error-input"/>
                                            </div>
                                            <div className="form-group col-span-6">
                                                <label htmlFor="discount_value">{t('İndirim Değeri')} *</label>
                                                <Field name="discount_value" className="w-full"/>
                                                <ErrorMessage name="discount_value" component="div"
                                                              className="error-input"/>
                                            </div>
                                        </div>

                                        {/* Stok & Min. Sepet Tutarı */}
                                        <div className="grid lg:grid-cols-12 gap-2 mb-2">
                                            <div className="form-group col-span-6">
                                                <label htmlFor="usage_limit_value">{t('Stok')} *</label>
                                                <Field name="usage_limit_value" className="w-full"/>
                                                <ErrorMessage name="usage_limit_value" component="div"
                                                              className="error-input"/>
                                            </div>
                                            <div className="form-group col-span-6">
                                                <label htmlFor="min_order_value">{t('Min. Sepet Tutarı')} *</label>
                                                <Field name="min_order_value" className="w-full"/>
                                                <ErrorMessage name="min_order_value" component="div"
                                                              className="error-input"/>
                                            </div>
                                        </div>

                                        {/* Tarihler */}
                                        <div className="grid lg:grid-cols-12 gap-2 mb-2">
                                            <div className="form-group col-span-6">
                                                <label htmlFor="start_date">{t('Başlangıç Tarihi')} *</label>
                                                <Field type="date" name="start_date" className="w-full"/>
                                                <ErrorMessage name="start_date" component="div"
                                                              className="error-input"/>
                                            </div>
                                            <div className="form-group col-span-6">
                                                <label htmlFor="end_date">{t('Bitiş Tarihi')} *</label>
                                                <Field type="date" name="end_date" className="w-full"/>
                                                <ErrorMessage name="end_date" component="div" className="error-input"/>
                                            </div>
                                        </div>

                                        <div className="form-group mb-2">
                                            <label htmlFor="is_first_order_only">
                                                {t('Sadece İlk Sipariş İçin mi?')} *
                                            </label>
                                            <select
                                                name="is_first_order_only"
                                                className="w-full"
                                                onChange={(e) => {
                                                    setFieldValue("is_first_order_only", e.target.value === '1' ? 1 : 0);
                                                }}
                                            >
                                                <option value={0}>{t('Hayır')}</option>
                                                <option value={1}>{t('Evet')}</option>
                                            </select>
                                            <ErrorMessage name="is_first_order_only" component="div"
                                                          className="error-input"/>
                                        </div>

                                        {/* Butonlar */}
                                        <div className="form-actions mt-3">
                                            <button type="reset" className="cancel-btn">
                                                {t('Temizle')}
                                            </button>
                                            <button type="submit" className="save-btn" disabled={isSubmitting}>
                                                {t('Kaydet')}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                {/* 📜 Kupon Listesi */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <label>{t('Kuponlar')}</label>
                            <ul className="list-none showcase-list">
                                {coupons.length > 0 ? (
                                    coupons.map((coupon) => (
                                        <li className="showcase-item" key={coupon.id}>
                                            <span>{coupon.code}</span>
                                            <div className="actions-btn">
                                                {/*<a href="#" className="bg-green-500 px-2 py-1 rounded-md hover:bg-green-600 me-1">*/}
                                                {/*    <i className="icon plus me-1"></i> İlan Ekle*/}
                                                {/*</a>*/}
                                                <Link
                                                    to={`${ROUTES.UI.COUPONEDIT}?id=${coupon.id}`}
                                                    state={{ id: coupon.id, couponId: coupon.id, coupon }}
                                                >
                                                    <button type="button"
                                                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 me-1">
                                                        <i className="icon edit me-1"></i> {t('Düzenle')}
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}  // 'handleDelete' fonksiyonunu user.id ile çağırıyoruz
                                                    type="button"
                                                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                                >
                                                    <i className="icon trash"></i>
                                                </button>

                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>{t('Hiç kupon bulunamadı.')}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coupon;
