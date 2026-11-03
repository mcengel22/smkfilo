import React, { useEffect } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { setReservationData } from "../../../../Repo/Redux/Modules/ReservationSlice";

// Validasyon şeması
const validationSchema = Yup.object({
    first_name: Yup.string().required("İsim zorunludur"),
    last_name: Yup.string().required("Soyisim zorunludur"),
    email: Yup.string().email("Geçerli bir email giriniz").required("Email zorunludur"),
    phone: Yup.string()
        .matches(/^\+?\d{10,15}$/, "Geçerli bir telefon numarası giriniz")
        .required("Telefon numarası zorunludur"),
    specialNotes: Yup.string().max(300, "En fazla 300 karakter girebilirsiniz"),
});

const normalize = (value) => (value === "" ? null : value);

const ReservationSync = () => {
    const { values, errors, touched } = useFormikContext();
    const dispatch = useDispatch();

    useEffect(() => {
        const guest = {};
        if (touched.first_name && !errors.first_name) {
            guest.first_name = normalize(values.first_name);
        }
        if (touched.last_name && !errors.last_name) {
            guest.last_name = normalize(values.last_name);
        }
        if (touched.email && !errors.email) {
            guest.email = normalize(values.email);
        }
        if (touched.phone && !errors.phone) {
            guest.phone = normalize(values.phone);
        }

        const dataToDispatch = {
            guest,
        };

        if (touched.specialNotes && !errors.specialNotes) {
            dataToDispatch.specialNotes = normalize(values.specialNotes);
        }

        // Sadece en az bir valid alan varsa Redux’a yaz
        if (Object.keys(guest).length > 0 || dataToDispatch.specialNotes !== undefined) {
            dispatch(setReservationData(dataToDispatch));
        }
    }, [values, errors, touched, dispatch]);

    return null;
};



const ReservationForm = () => {
    const reservation = useSelector((state) => state.reservation);

    const initialValues = {
        first_name: reservation.guest?.first_name || "",
        last_name: reservation.guest?.last_name || "",
        email: reservation.guest?.email || "",
        phone: reservation.guest?.phone || "",
        specialNotes: reservation.specialNotes || "",
    };

    return (
        <div className="contact-form card bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <img src="/svg/user.svg" alt="User" width={24} height={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">İletişim Bilgileri</h3>
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={() => {}}
                validateOnMount
            >
                {({ errors, touched }) => (
                    <Form className="space-y-6">
                        {/* İsim ve Soyisim */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İsim <span className="text-orange-500">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <i className="icon user"></i>
                                    <Field
                                        name="first_name"
                                        type="text"
                                        placeholder="Adınız"
                                        className="form-input pl-10 w-full h-11 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                {touched.first_name && errors.first_name && (
                                    <div className="error-input">{errors.first_name}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Soyisim <span className="text-orange-500">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <i className="icon user"></i>
                                    <Field
                                        name="last_name"
                                        type="text"
                                        placeholder="Soyadınız"
                                        className="form-input pl-10 w-full h-11 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                {touched.last_name && errors.last_name && (
                                    <div className="error-input">{errors.last_name}</div>
                                )}
                            </div>
                        </div>

                        {/* E-posta ve Telefon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-posta <span className="text-orange-500">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <i className="icon envelope-text"></i>
                                    <Field
                                        name="email"
                                        type="email"
                                        placeholder="ornek@email.com"
                                        className="form-input pl-10 w-full h-11 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                {touched.email && errors.email && (
                                    <div className="error-input">{errors.email}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefon <span className="text-orange-500">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <i className="icon call"></i>
                                    <Field
                                        name="phone"
                                        type="tel"
                                        placeholder="+90 5XX XXX XX XX"
                                        className="form-input pl-10 w-full h-11 border rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                {touched.phone && errors.phone && (
                                    <div className="error-input">{errors.phone}</div>
                                )}
                            </div>
                        </div>

                        {/* Özel Notlar */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Özel Notlar
                            </label>
                            <div className="input-with-icon">
                                <Field
                                    as="textarea"
                                    name="specialNotes"
                                    maxLength={300}
                                    placeholder="Eklemek istediğiniz notlar..."
                                    className="form-input pl-10 w-full min-h-[100px] border rounded-lg focus:ring-2 focus:ring-orange-500 resize-none py-2"
                                />
                            </div>
                            {touched.specialNotes && errors.specialNotes && (
                                <div className="error-input">{errors.specialNotes}</div>
                            )}
                        </div>

                        {/* KVKK Bilgilendirmesi */}
                        <div className="info-box bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                            <img
                                src="/svg/info2.svg"
                                alt="Info"
                                width={20}
                                height={20}
                                className="flex-shrink-0 mt-1"
                            />
                            <div className="flex-grow">
                                <p className="text-sm text-blue-700">
                                    Kişisel verileriniz güvenle saklanmaktadır. Bilgileriniz üçüncü şahıslarla paylaşılmaz.
                                </p>
                            </div>
                        </div>

                        {/* Redux Syncer */}
                        <ReservationSync />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ReservationForm;
