import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import RegionSelect from "../../../../Pages/Ui/UserPanel/Crud/Misc/RegionSelect";
import { useContact } from "../../../../ServerSide/Hooks/useContact";

const GetQuote = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { createContacts } = useContact();

    const initialValues = {
        email: "",
        region_id: "",
        phone: "",
        description: "",
        fullname: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email().required(),
        fullname: Yup.string().required(),
        phone: Yup.string().required(),
        description: Yup.string().required(),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsLoading(true);
            const res = await createContacts(values);
            if (res?.success) resetForm();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="get-offer">

            <div className="container">

                <div className="grid">

                    {/* SOL TEXT */}
                    <div className="left">

                        <span className="sub-title">
                            Hızlı & Güvenilir Araç Kiralama
                        </span>

                        <h2>
                            İHTİYACINA EN UYGUN ARACI HEMEN BUL
                        </h2>

                        <p>
                            Şehir içi, uzun yol veya özel ihtiyaçlarınız için geniş araç filomuzdan en uygun seçeneği sunuyoruz.
                        </p>

                        <ul>
                            <li>✔ Uygun fiyat garantisi</li>
                            <li>✔ Geniş araç filosu</li>
                            <li>✔ Hızlı rezervasyon</li>
                            <li>✔ 7/24 destek</li>
                        </ul>

                    </div>

                    {/* FORM */}
                    <div className="right">

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {() => (
                                <Form className="form-card">

                                    <Field name="fullname" placeholder="Ad Soyad" />
                                    <Field name="email" placeholder="E-posta" />
                                    <Field name="phone" placeholder="Telefon" />
                                    <Field as="textarea" name="description" placeholder="Talebinizi yazın..." />

                                    <RegionSelect name="region_id" />

                                    <button type="submit">
                                        {isLoading ? "Gönderiliyor..." : "Teklif Al"}
                                    </button>

                                </Form>
                            )}
                        </Formik>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default GetQuote;