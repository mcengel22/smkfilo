import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-dropdown-select";
import { Formik, Form, Field, FieldArray, useFormikContext } from "formik";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactSwitch from "react-switch";
import AdvertGallery from "./Misc/AdvertGallery";
import CoverImage from "./Misc/CoverImage";
import AdvertRules from "./Misc/Rules";
import AdvertServices from "./Misc/Services";
import AdvertNearby from "./Misc/Nearby";
import AdvertFeature from "./Misc/Feature";
import AdvertPrice from "./Misc/Price";
import { useAttr } from "@/ServerSide/Hooks/useAttr.jsx";
import { useParams } from "react-router-dom";
import RegionSelect from "../../UserPanel/Crud/Misc/RegionSelect";
import Loader from "@/Components/Loader.jsx";
import { toast } from "react-toastify";
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { usePost } from "../../../../ServerSide/Hooks/usePost";

const PostEdit = () => {
    const { t } = useTranslation();
    const { getAttrwType } = useAttr();
    const { slug } = useParams();
    const { get_post, updatePosts } = usePost();

    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [attrIsLoading, setAttrIsLoading] = useState(false);
    const [type, setType] = useState(null); // URL'den değil, post'tan gelecek

    const [category, setCategory] = useState([]);
    const [features, setFeatures] = useState([]);
    const [near, setNear] = useState([]);
    const [rules, setRules] = useState([]);
    const [operation, setOperation] = useState([]);

    // ✅ post geldikten sonra type varsa set et
    useEffect(() => {
        if (post?.data?.type) {
            setType(post.data.type);
        }
    }, [post]);

    // 📦 type değiştiğinde attribute verilerini getir
    useEffect(() => {
        if (!type) return;
        getAttr_wType(type, "category");
        getAttr_wType(type, "features");
        getAttr_wType(type, "near");
        getAttr_wType(type, "rules");
        getAttr_wType(type, "operation");
    }, [type]);

    // 📡 Post detayını çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get_post(slug);
                setPost(response);
                setIsLoading(false);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            }
        };
        fetchData();
    }, []);

    // 🔌 Attribute çekme helper'ı
    const getAttr_wType = async (attr_type, post_type) => {
        setAttrIsLoading(true);
        try {
            const response = await getAttrwType(attr_type, post_type);
            if (post_type === "category") setCategory(response.data);
            else if (post_type === "features") setFeatures(response.data);
            else if (post_type === "near") setNear(response.data);
            else if (post_type === "rules") setRules(response.data);
            else if (post_type === "operation") setOperation(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setAttrIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get_post(slug);
                setPost(response);
                setPost(response);
                setIsLoading(false);
                console.log(response);
            } catch (error) {
                console.error("Veri çekme hatası:", error);
            }
        };
        fetchData();
    }, []);

    // key'e göre detayı bulur, her zaman string döner 🔒
    const getDetailValue = (key) => {
        // post içindeki details array’inden eşleşeni al
        const detail = post?.data?.details?.find((item) => item.key === key);

        const val = detail?.value ?? "";

        return String(val);
    };

    function stripHtml(html) {
        // Tüm <…> etiketlerini boş stringle değiştir
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    }

    const initialValues = useMemo(() => {
        const attributes = post?.data?.attributes || {};

        return {
            title: post?.data?.title || "",
            region_id: post?.data?.region_id || "",
            neighborhood: post?.data?.neighborhood || "",
            description: post?.data?.description || "",
            type: post?.data?.type || "",
            prices:
                post?.data?.prices?.map((price) => ({
                    years: price.years || "",
                    km: price.km || "",
                    value: price.price || "",
                })) || [],
            gallery: post?.data?.gallery.map((group) => ({
                id: group.id,
                value: group.title,
                image: group.images.map((img) => ({
                    id: img.id,
                    url: img.media_url,
                    title: img.media_title,
                })),
            })),
            cover_image: null,

            attr: {
                category: (attributes.category || []).map((item) => item.id),
                features: (attributes.features || []).map((item) => ({
                    id: item.id,
                    value: item.value || "", // veya backend'den geldiyse item.value
                })),
                near: (attributes.near || []).map((item) => ({
                    id: item.id,
                    value: item.value || "",
                })),
                rules: (attributes.rules || []).map((item) => ({
                    id: item.id,
                    value: item.value || "", // örneğin 'suitable'
                })),
                services: (attributes.services || []).map((item) => ({
                    id: item.id,
                    value: item.value || "", // örneğin 'paid'
                })),
            },

            Detail: {
                check_in: getDetailValue("check_in"),
                check_out: getDetailValue("check_out"),
                tursab_no: getDetailValue("tursab_no"),
                deposit: getDetailValue("deposit"),
                prepayment: getDetailValue("prepayment"),
                cleaning_fee: getDetailValue("cleaning_fee"),
                cleaning_fee_days: getDetailValue("cleaning_fee_days"),
                m2: getDetailValue("m2"),
                room_count: getDetailValue("room_count"),
                bathroom_count: getDetailValue("bathroom_count"),
                bed_count: getDetailValue("bed_count"),
                people_count: getDetailValue("people_count"),
                pool_size: getDetailValue("pool_size") || 0,
                length: getDetailValue("length"),
                engine_power: getDetailValue("engine_power"),
                has_captain: getDetailValue("has_captain"),
            },
        };
    }, [post, type]);

    if (
        isLoading ||
        !post ||
        !category ||
        !features ||
        !near ||
        !rules ||
        !operation
    )
        return <Loader />;

    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await updatePosts(values, slug);

            if (response.success === true) {
                // ✅ Başarılı bildirim
                toast.success(
                    response.data.message || t("İlan başarıyla değiştirildi."),
                );

                // ✅ 1 saniye bekleyip ilanlar sayfasına yönlendir
                setTimeout(() => {
                    window.location.href = ROUTES.UI.ADVERT; // 🔥 /Panel/Ilanlarim
                }, 1000);
            } else {
                toast.error(response.message || t("Bir hata oluştu"));
            }
        } catch (e) {
            console.error("İlan güncellenirken hata:", e);

            if (
                e.response &&
                e.response.status === 422 &&
                e.response.data.errors
            ) {
                toast.error(
                    t("Lütfen eksik veya hatalı alanları kontrol edin."),
                );
            } else {
                toast.error(
                    e.message || t("İlan güncellenirken bir hata oluştu"),
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto p-6 create-adverts">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {t("İlan Düzenle")}
            </h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            {/* Kapak Görseli */}
                            <div>
                                <CoverImage
                                    image={
                                        values.cover_image ?? post?.data?.cover
                                    }
                                />
                            </div>

                            <hr className="my-4 border-1 border-orange-500"></hr>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold">
                                        {t("Ürün adı")}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="title"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
                                <div>
                                    <RegionSelect
                                        defaultRegion={post?.data?.region}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="neighborhood"
                                        className="block text-gray-700 font-semibold"
                                    >
                                        {t("Tam Adres")}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="neighborhood"
                                        name="neighborhood"
                                        placeholder={t("Tam Adres Yazınız")}
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
                            </div>

                            {/* <div className="grid lg:grid-cols-12 gap-1 mt-6">
                                <div className="col-span-12">
                                    <label className="block text-gray-700 font-semibold">
                                        {t('Giriş - Çıkış Saati')}<span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="check_in_time"
                                        className="block text-md text-gray-700 font-semibold"
                                    >
                                        {t('Giriş Saati')}
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
                                        {t('Tursab Belge No')}<span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="tursab_no"
                                        name="Detail[tursab_no]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div> */}
                                <div className="col-span-3">
                                    <label
                                        htmlFor="damage_deposit"
                                        className="block text-gray-700 font-semibold"
                                    >
                                        {t("Hasar Depozitosu")}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="number"
                                        id="damage_deposit"
                                        name="Detail[deposit]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="prepayment_percentage"
                                        className="block text-gray-700 font-semibold"
                                    >
                                        {t("Ön Ödeme Yüzdesi")}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="number"
                                        id="prepayment_percentage"
                                        name="Detail[prepayment]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
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
                                        name="Detail[cleaning_fee]"
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="cleaning_fee_days"
                                        className="block text-gray-700 font-semibold"
                                    >
                                        {t('Temizlik Ücreti Gün')}<span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="number"
                                        id="cleaning_fee_days"
                                        name="Detail[cleaning_fee_days]"
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div> */}
                            </div>

                            <div className="grid lg:grid-cols-12 gap-6 mt-6">
                                {/* <div className="col-span-3">
                                    <label htmlFor="m2" className="block text-gray-700 font-semibold">
                                        {t('Metrekare')}<span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="number"
                                        id="m2"
                                        name="Detail[m2]"
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
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
                                        name="Detail[pool_size]"
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
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
                                        name="Detail[room_count]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
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
                                        name="Detail[bathroom_count]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
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
                                        name="Detail[bed_count]"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label
                                        className="block text-gray-700 font-semibold"
                                        htmlFor="adult_count"
                                    >
                                        {t('Kapasite')}<span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="number"
                                        id="adult_count"
                                        name="Detail.people_count"
                                        required
                                        className="w-full border border-gray-300 rounded p-2  mt-1"
                                    />
                                </div> */}
                            </div>

                            {/* {(type === 'boat') && (
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
                                            checked={values.Detail.has_captain === "true" || values.Detail.has_captain === true}
                                            onChange={(checked) =>
                                                setFieldValue("Detail.has_captain", checked ? "true" : "false")
                                            }
                                            checkedIcon={false}
                                            uncheckedIcon={false}
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
                                        {t("Açıklama")}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <Field name="description">
                                        {({ field, form }) => (
                                            <div className="ck-editor__editable rounded border border-gray-300 p-2">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={field.value}
                                                    onChange={(
                                                        event,
                                                        editor,
                                                    ) => {
                                                        const data =
                                                            editor.getData();
                                                        form.setFieldValue(
                                                            field.name,
                                                            data,
                                                        ); // Formik’e yaz
                                                    }}
                                                    onBlur={() => {
                                                        form.setFieldTouched(
                                                            field.name,
                                                            true,
                                                        );
                                                    }}
                                                    config={{
                                                        language: "tr",
                                                        toolbar: [
                                                            "heading",
                                                            "|",
                                                            "bold",
                                                            "italic",
                                                            "underline",
                                                            "strikethrough",
                                                            "|",
                                                            "link",
                                                            "bulletedList",
                                                            "numberedList",
                                                            "|",
                                                            "insertTable",
                                                            "blockQuote",
                                                            "undo",
                                                            "redo",
                                                        ],
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>

                            <hr className="my-4 border-1 border-orange-500"></hr>

                            <div className="grid lg:grid-cols-12 gap-6 mt-4">
                                <div className="col-span-12">
                                    <label className="block text-gray-700 font-semibold">
                                        {t("Araç Türü")}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        options={category ?? []}
                                        labelField="title"
                                        valueField="id"
                                        multi
                                        name="category"
                                        values={category?.filter((cat) =>
                                            values.attr.category.includes(
                                                cat.id,
                                            ),
                                        )}
                                        onChange={(selected) => {
                                            const selectedIds = selected.map(
                                                (item) => item.id,
                                            );
                                            setFieldValue(
                                                "attr.category",
                                                selectedIds,
                                            );
                                        }}
                                        placeholder="Araç Türü Seçiniz"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <hr className="my-4 border-1 border-orange-500"></hr>
                            {/* Özellikler */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {t("Özellikler")}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <AdvertFeature
                                    data={features}
                                    vals={post?.data?.attributes?.features}
                                />
                            </div>

                            {/* <hr className="my-4 border-1 border-orange-500"></hr> */}
                            {/* Markalar Ekle */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {t("Marka Ekle")}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <AdvertNearby
                                    data={near}
                                    vals={post?.data?.attributes?.near}
                                />
                            </div>

                            <hr className="my-4 border-1 border-orange-500"></hr>
                            {/* Kurallar */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {t("Kurallar")}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <AdvertRules
                                    data={rules}
                                    vals={post?.data?.attributes?.rules}
                                />
                            </div>

                            {/* <hr className="my-4 border-1 border-orange-500"></hr> */}
                            {/* Yakıt */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {t("Yakıt")}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <AdvertServices
                                    data={operation}
                                    vals={post?.data?.attributes?.operation}
                                />
                            </div>

                            {/* Fiyat Ekle */}
                            <hr className="my-4 border-1 border-orange-500"></hr>
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {t("Fiyat Ekle")}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <AdvertPrice vals={post?.data?.prices} />
                            </div>

                            {/* Galeri */}
                            <hr className="my-4 border-1 border-orange-500"></hr>
                            <div>
                                <AdvertGallery vals={post?.data?.gallery} />
                            </div>

                            <hr className="my-4 border-1 border-orange-500"></hr>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading || values.isSubmitting}
                                    className="bg-blue-500 text-white px-6 py-3 rounded"
                                >
                                    {isLoading || values.isSubmitting
                                        ? t("Kaydediliyor…")
                                        : t("Kaydet")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PostEdit;
