import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, FormikProvider, useFormikContext} from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactSwitch from "react-switch";
import { useLocation } from "react-router-dom";
import Select from "react-dropdown-select";

import AdvertGallery from "./Misc/AdvertGallery";
import CoverImage from "./Misc/CoverImage";
import AdvertRules from "./Misc/Rules";
import AdvertServices from "./Misc/Services";
import AdvertNearby from "./Misc/Nearby";
import AdvertFeature from "./Misc/Feature";
import AdvertPrice from "./Misc/Price";
import RegionSelect from "./Misc/RegionSelect";

import { useAttr } from "../../../../ServerSide/Hooks/useAttr";
import { usePost } from "../../../../ServerSide/Hooks/usePost";
import { useSelector } from "react-redux";
import { ROUTES } from "../../../../Libs/Routes/config";
import Header from "../../../../Components/UI/Header/Header";

const PostCreate = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { getAttrwType } = useAttr();
    const { createPost } = usePost();
    const isLoading = useSelector(state => state.post.loading);

    // URL’den tip al
    const type = useMemo(() => {
        const qs = new URLSearchParams(location.search);
        return qs.get('type') || "";
    }, [location.search]);

    // Attribute’ları çek
    const [categories, setCategories] = useState([]);
    const [features, setFeatures]   = useState([]);
    const [near, setNear]           = useState([]);
    const [rules, setRules]         = useState([]);
    const [operation, setOperation] = useState([]);


    useEffect(() => {
        if (!type) return;
        let isUnmounted = false;

        (async () => {
            const attrs = ['category', 'features', 'near', 'rules', 'operation'];
            const res = await Promise.all(attrs.map(a => getAttrwType(type, a))); // ✅ düzeltildi

            if (!isUnmounted) {
                setCategories(res[0].data);
                setFeatures(res[1].data);
                setNear(res[2].data);
                setRules(res[3].data);
                setOperation(res[4].data);
            }
        })();

        return () => { isUnmounted = true; };
    }, [type]);


    // initialValues’u useMemo ile oluştur
    const initialValues = useMemo(() => {
        const base = {
            title: "", region_id: "", neighborhood: "", description: "", type,
            cover_image: null,
            gallery: [],
                Detail: {
                check_in: "16:00", check_out: "10:00", tursab_no: "",
                deposit: "", prepayment: "50",
                cleaning_fee: "", cleaning_fee_days: "7",
                m2: "", room_count: "", bathroom_count: "",
                bed_count: "", people_count: "",
            }
        };
        if (['villa','bungalow'].includes(type)) {
            base.Detail.pool_size = "";
        } else if (type === 'boat') {
            base.Detail.length = "";
            base.Detail.engine_power = "";
            base.Detail.has_captain = false;
        }
        return base;
    }, [type]);

    const handleSubmit = useCallback(async (values, { setSubmitting }) => {
        try {
            values.type = type; // type'ı ekle

            // 🔥 Boş gelen DETAIL alanlarını otomatik "0" yap
            if (values.Detail) {
                Object.keys(values.Detail).forEach(key => {
                    if (
                        values.Detail[key] === "" ||
                        values.Detail[key] === null ||
                        values.Detail[key] === undefined
                    ) {
                        values.Detail[key] = "0";
                    }
                });
            }

            // İlan oluşturma isteği
            const { success, data, message } = await createPost(values);

            if (success) {
                setTimeout(() => {
                    window.location.href = ROUTES.UI.ADVERT;
                }, 1000);
            }

        } catch (e) {
            console.error("İlan oluşturulurken hata:", e);

            if (e.response && e.response.status === 422 && e.response.data.errors) {
                // Validation error durumunda istersen mesajları burada işleyebiliriz
            }

        } finally {
            setSubmitting(false);
        }
    }, [createPost, t, type]);






    return (
        <div>
            <Header/>
            <div className="max-w-8xl mx-auto p-6 create-adverts">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {t('Yeni İlan Oluştur')}
                </h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(formikProps) => (
                            <FormikProvider value={formikProps}>
                                <Form>
                                    {/* Kapak Görseli */}
                                    <div>
                                        <CoverImage />
                                    </div>
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-semibold">
                                                {t('Araç Marka')} <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="text"
                                                id="title"
                                                name="title"
                                                required
                                                placeholder={t('Araç marka giriniz')}
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div>
                                            <RegionSelect />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="neighborhood"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Tam Adres')} <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="text"
                                                id="neighborhood"
                                                name="neighborhood"
                                                placeholder={t('Tam Adres Yazınız')}
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="grid lg:grid-cols-12 gap-1 mt-6">
                                        <div className="col-span-12">
                                            <label className="block text-gray-700 font-semibold">
                                                {t('Teslim Saati - Bitiş Saati')}<span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="check_in_time"
                                                className="block text-md text-gray-700 font-semibold"
                                            >
                                                {t('Başlangıç Saati')}
                                            </label>
                                            <Field
                                                type="time"
                                                id="check_in_time"
                                                name="Detail.check_in"
                                                required
                                                className="border rounded-lg p-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="check_out_time"
                                                className="block text-md text-gray-700 font-semibold"
                                            >
                                                {t('Çıkış Saati')}
                                            </label>
                                            <Field
                                                type="time"
                                                id="check_out_time"
                                                name="Detail.check_out"
                                                required
                                                className="border rounded-lg p-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                                            />
                                        </div>
                                    </div> */}

                                    <div className="grid lg:grid-cols-12 gap-6 mt-6">
                                        {/* <div className="col-span-3">
                                            <label
                                                htmlFor="tursab_no"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Tursab Belge No')}
                                            </label>

                                            <Field
                                                type="text"
                                                id="tursab_no"
                                                name="Detail.tursab_no"
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div> */}

                                        <div className="col-span-3">
                                            <label
                                                htmlFor="deposit"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Hasar Depozitosu')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="deposit"
                                                name="Detail.deposit"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label
                                                htmlFor="prepayment"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Ön Ödeme Yüzdesi')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="prepayment"
                                                name="Detail.prepayment"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        {/* <div className="col-span-2">
                                            <label
                                                htmlFor="cleaning_fee"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Temizlik Ücreti')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="cleaning_fee"
                                                name="Detail.cleaning_fee"
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div> */}
                                        {/* <div className="col-span-2">
                                            <label
                                                htmlFor="cleaning_fee_days"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Temizlik Ücreti Gün')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="cleaning_fee_days"
                                                name="Detail.cleaning_fee_days"
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div> */}
                                    </div>

                                    {/* <div className="grid lg:grid-cols-12 gap-6 mt-6">
                                        <div className="col-span-3">
                                            <label htmlFor="m2" className="block text-gray-700 font-semibold">
                                                {t('Metrekare')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="m2"
                                                name="Detail.m2"
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        { (type === 'villa' || type === 'bungalow') && (
                                            <>
                                                <div className="col-span-2">
                                                    <label
                                                        htmlFor="pool_size"
                                                        className="block text-gray-700 font-semibold"
                                                    >
                                                        {t('Havuz Metrekare')}
                                                    </label>
                                                    <Field
                                                        type="number"
                                                        id="pool_size"
                                                        name="Detail.pool_size"
                                                        className="w-full border border-gray-300 rounded p-2 mt-1"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="room_count"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Oda Sayısı')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="room_count"
                                                name="Detail.room_count"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="bathroom_count"
                                                className="block text-gray-700 font-semibold"
                                            >
                                                {t('Banyo Sayısı')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="bathroom_count"
                                                name="Detail.bathroom_count"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label
                                                className="block text-gray-700 font-semibold"
                                                htmlFor="bed_count"
                                            >
                                                {t('Yatak Odası')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="bed_count"
                                                name="Detail.bed_count"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label
                                                className="block text-gray-700 font-semibold"
                                                htmlFor="people_count"
                                            >
                                                {t('Maks. Kişi Sayısı')}<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="people_count"
                                                name="Detail.people_count"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 mt-1"
                                            />
                                        </div>
                                    </div> */}
                                    {/* { (type === 'boat') && (
                                        <div className="grid lg:grid-cols-12 gap-6 mt-6">
                                            <div className="col-span-4">
                                                <label htmlFor="length" className="block text-gray-700 font-semibold">
                                                    {t('Uzunluk')}<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    id="length"
                                                    name="Detail.length"
                                                    className="border border-gray-300 rounded p-2 mt-1 w-full"
                                                />
                                            </div>

                                            <div className="col-span-4">
                                                <label htmlFor="engine_power" className="block text-gray-700 font-semibold">
                                                    {t('Motor Gücü(HP)')}<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="number"
                                                    id="engine_power"
                                                    name="Detail.engine_power"
                                                    className="border border-gray-300 rounded p-2 mt-1 w-full"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label
                                                    htmlFor="has_captain"
                                                    className="block text-gray-700 font-semibold"
                                                >
                                                    {t('Kaptan Var Mı?')}<span className="text-red-500">*</span>
                                                </label>
                                                <ReactSwitch
                                                    checkedIcon={false}
                                                    uncheckedIcon={false}
                                                    checked={formikProps.values.Detail.has_captain}
                                                    onChange={(checked) => formikProps.setFieldValue('Detail.has_captain', checked)}
                                                    id="has_captain"
                                                    name="Detail.has_captain"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    )} */}

                                    {/* Açıklama */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="grid lg:grid-cols-12 gap-6 mt-6">
                                        <div className="col-span-12">
                                            <label
                                            htmlFor="description"
                                            className="block text-gray-700 font-semibold mb-1"
                                            >
                                            {t('Açıklama')}<span className="text-red-500">*</span>
                                            </label>

                                            <Field name="description">
                                            {({ field, form }) => (
                                                <div className="ck-editor__editable rounded border border-gray-300 p-2">
                                                <CKEditor
                                                    editor={ ClassicEditor }
                                                    data={ field.value }                    // Formik’dekivalue
                                                    onChange={ (event, editor) => {
                                                    const data = editor.getData();
                                                    form.setFieldValue(field.name, data); // Formik’e yaz
                                                    }}
                                                    onBlur={ () => {
                                                    form.setFieldTouched(field.name, true);
                                                    }}
                                                    config={{
                                                    language: 'tr',
                                                    toolbar: [
                                                        'heading', '|',
                                                        'bold','italic','underline','strikethrough','|',
                                                        'link','bulletedList','numberedList','|',
                                                        'insertTable','blockQuote','undo','redo'
                                                    ]
                                                    }}
                                                />
                                                </div>
                                            )}
                                            </Field>
                                        </div>
                                    </div>


                                    {/* Araç Tipi */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="col-span-12">
                                        <label className="block text-gray-700 font-semibold">
                                            {t('Araç Türü')}<span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            options={categories}
                                            labelField="title"
                                            valueField="slug"
                                            multi
                                            name="attr.category"
                                            placeholder={t("Araç Türü Seçiniz")}
                                            className="mt-1"
                                            onChange={(selectedOptions) => {
                                                const ids = selectedOptions.map(opt => opt.id);
                                                formikProps.setFieldValue("attr.category", ids);
                                            }}
                                        />
                                    </div>

                                    {/* Özellikler */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('Özellikler')}<span className="text-red-500">*</span>
                                        </h2>
                                        <AdvertFeature data={features} />
                                    </div>

                                    {/* Markalar Ekle */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('Marka Ekle')}<span className="text-red-500">*</span>
                                        </h2>
                                        <AdvertNearby data={near}/>
                                    </div>

                                    {/* Kurallar */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('Kurallar')}<span className="text-red-500">*</span>
                                        </h2>
                                        <AdvertRules data={rules}/>
                                    </div>

                                    {/* Yakıt */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('Yakıt')}<span className="text-red-500">*</span>
                                        </h2>
                                        <AdvertServices data={operation}/>
                                    </div>

                                    {/* Fiyat Ekle */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div className="mt-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('Fiyat Ekle')}<span className="text-red-500">*</span>
                                        </h2>
                                        <AdvertPrice />
                                    </div>

                                    {/* Galeri */}
                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    <div>
                                        <AdvertGallery />
                                    </div>

                                    <hr className="my-4 border-1 border-orange-500"></hr>
                                    {/* Gönder butonu */}
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            disabled={formikProps.isSubmitting}
                                            className="bg-blue-500 text-white px-6 py-3 rounded"
                                        >
                                            {formikProps.isSubmitting
                                                ? t('Kaydediliyor…')
                                                : t('Kaydet')
                                            }
                                        </button>
                                    </div>
                                </Form>
                            </FormikProvider>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default PostCreate;
