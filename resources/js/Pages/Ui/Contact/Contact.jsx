import React, { useState } from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RegionSelect from "../../../Pages/Ui/UserPanel/Crud/Misc/RegionSelect";
import { useContact } from "../../../ServerSide/Hooks/useContact";

const Contact = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { createContacts } = useContact(); // API çağrısı yapan hook

    // 🟢 Form başlangıç değerleri
    const initialValues = {
        email: "",
        region_id: "",
        phone: "",
        description: "",
        fullname: "",
    };

    // 🟡 Validasyon şeması
    const validationSchema = Yup.object({
        email: Yup.string()
            .email(t("Geçerli bir email adresi giriniz"))
            .required(t("Email adresi zorunludur")),
        region_id: Yup.string(),
        fullname: Yup.string().required(t("Ad ve soyad zorunlu")),
        phone: Yup.string().required(t("Telefon zorunlu")),
        description: Yup.string().required(t("Mesaj Alanı zorunlu")),
    });

    // 🔴 Submit işlemi
    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsLoading(true);
            await createContacts(values);

            resetForm(); // form temizleniyor
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="contact">
                <div className="max-w-8xl mx-auto sm:px-2 my-5 md:px-2 px-4">
                    <h1 className="text-2xl font-bold mb-4">{t("İletişim")}</h1>

                    <div className="grid lg:grid-cols-12 gap-6 mt-4">
                        {/* Sol Bölüm: İletişim Formu */}
                        <div className="lg:col-span-6 col-span-12">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="font-bold mb-3 text-xl">
                                    {t("Bizimle İletişime Geçin!")}
                                </h2>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched }) => (
                                        <Form>
                                            <Field
                                                id="fullname"
                                                type="text"
                                                name="fullname"
                                                className="form-control w-full border border-gray-300 rounded p-2 mb-2 font-semibold"
                                                placeholder={t("İsim Soyisim")}
                                                required
                                            />
                                            <Field
                                                id="email"
                                                type="email"
                                                name="email"
                                                className="form-control w-full border border-gray-300 rounded p-2 mb-2 font-semibold"
                                                placeholder={t("E-Posta")}
                                                required
                                            />
                                            <Field
                                                id="phone"
                                                type="text"
                                                name="phone"
                                                className="form-control w-full border border-gray-300 rounded p-2 mb-2 font-semibold"
                                                placeholder={t(
                                                    "Telefon Numarası",
                                                )}
                                                required
                                            />
                                            <Field
                                                id="description"
                                                type="text"
                                                name="description"
                                                className="form-control w-full border border-gray-300 rounded p-2 mb-2 font-semibold"
                                                placeholder={t("Açıklama")}
                                                required
                                            />

                                            <div>
                                                <RegionSelect name="region_id" />
                                            </div>
                                            <button
                                                className="btn btn-primary mt-2"
                                                type="submit"
                                            >
                                                {t("Gönder")}
                                            </button>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>

                        {/* Sağ Bölüm: İletişim Bilgileri */}
                        <div className="lg:col-span-6 col-span-12">
                            <div className="lg:col-span-6 col-span-12 mb-3">
                                <h2 className="font-bold mb-3 text-xl">
                                    {t("Bize Ulaşabilirsiniz!")}
                                </h2>
                                <div className="bg-white p-4 rounded-lg shadow-lg info lg:flex-row md:flex-col flex justify-between items-center">
                                    <div className="info-title">
                                        <i className="icon call"></i>
                                        {t("Telefon Numarası")}
                                    </div>
                                    <div className="flex flex-col">
                                        <a href="tel:+905305421233">
                                            +90 530 542 12 33
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 col-span-12 mb-3">
                                <div className="bg-white p-4 rounded-lg shadow-lg info lg:flex-row md:flex-col flex justify-between items-center">
                                    <div className="info-title">
                                        <i className="icon call"></i>
                                        {t("Müşteri Hizmetleri")}
                                    </div>
                                    <a href="tel:+905305421233">
                                        +90 530 542 12 33
                                    </a>
                                </div>
                            </div>

                            <div className="lg:col-span-6 col-span-12 mb-3">
                                <div className="bg-white p-4 rounded-lg shadow-lg info lg:flex-row md:flex-col flex justify-between items-center">
                                    <div className="info-title">
                                        <i className="icon envelope-text"></i>
                                        {t("E-Posta")}
                                    </div>
                                    <div className="flex flex-col">
                                        <a href="mailto:info@smkfilo.com">
                                            info@smkfilo.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 col-span-12">
                                <div className="bg-white p-4 rounded-lg info shadow-lg lg:flex-row md:flex-col flex justify-between items-center">
                                    <div className="info-title">
                                        <i className="icon map"></i>
                                        {t("Adres")}
                                    </div>
                                    <p>İstanbul Beylikdüzü</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
