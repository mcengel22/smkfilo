import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useSeo } from "@/ServerSide/Hooks/useSeo";
import RegionSelect from "@/Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SeoEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { getSeo, updateSeo } = useSeo();

    const [initialValues, setInitialValues] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [defaultRegion, setDefaultRegion] = useState(null);

    const validationSchema = Yup.object({
        main_title: Yup.string().required("Ana başlık zorunlu"),
        main_description: Yup.string().required("Açıklama zorunlu"),
        canonical_url: Yup.string().url("Geçerli URL girin").nullable(),
        type: Yup.string().required("Tür zorunlu"),
        region_id: Yup.string().nullable(),
        keywords: Yup.string().nullable(),
        image: Yup.mixed().nullable(),
        meta_title: Yup.string().nullable(),
        meta_description: Yup.string().nullable(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSeo(id);

                setInitialValues({
                    meta_title: data.meta_title || "",
                    meta_description: data.meta_description || "",
                    main_title: data.main_title || "",
                    titles: data.titles || [""],
                    main_description: data.main_description || "",
                    descriptions: data.descriptions || [""],
                    canonical_url: data.canonical_url || "",
                    type: data.type || "",
                    region_id: data.region_id ? data.region_id.toString() : "",
                    keywords: data.keywords || "",
                    image: null,
                });

                if (data.region) {
                    setDefaultRegion({
                        id: data.region.id,
                        name: data.region.name,
                    });
                }

                if (data.image) {
                    const base = import.meta.env.APP_URL;
                    const imgUrl = data.image.startsWith("http")
                        ? data.image
                        : `${base.replace(/\/$/, "")}${
                              data.image.startsWith("/") ? "" : "/"
                          }${data.image}`;
                    setPreviewUrl(imgUrl);
                }
            } catch (err) {
                console.error("SEO verisi çekilemedi:", err);
            }
        };

        fetchData();

        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [id]);

    if (!initialValues) {
        return <p className="p-4">{t("Yükleniyor...")}</p>;
    }

    return (
        <div className="seo-edit p-6">
            <div className="title mb-6">
                <h1 className="text-2xl font-bold">
                    {t("SEO Kaydını Düzenle")}
                </h1>
                <p className="text-gray-500">
                    {t("Mevcut SEO kaydını güncelleyin")}
                </p>
            </div>

            <div className="card bg-white shadow-md rounded-lg p-6">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const formData = new FormData();

                            if (values.image) {
                                formData.append("image", values.image);
                            }

                            Object.entries(values).forEach(([key, value]) => {
                                if (key === "image") return;
                                if (Array.isArray(value)) {
                                    value.forEach((v) =>
                                        formData.append(`${key}[]`, v),
                                    );
                                } else {
                                    if (value !== null && value !== undefined)
                                        formData.append(key, value);
                                }
                            });

                            await updateSeo(formData, id);
                        } catch (error) {
                            console.error("SEO güncelleme hatası:", error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="grid gap-6">
                            {/* 🆕 Meta Title */}
                            <div>
                                <label className="font-semibold">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={values.meta_title}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "meta_title",
                                            e.target.value,
                                        )
                                    }
                                    className="border rounded p-2 w-full"
                                    placeholder="Sayfa başlığı (meta title)"
                                />
                            </div>

                            {/* 🆕 Meta Description */}
                            <div>
                                <label className="font-semibold">
                                    Meta Description
                                </label>
                                <textarea
                                    name="meta_description"
                                    rows="3"
                                    value={values.meta_description}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "meta_description",
                                            e.target.value,
                                        )
                                    }
                                    className="border rounded p-2 w-full"
                                    placeholder="Sayfa açıklaması (meta description)"
                                />
                            </div>

                            {/* Tür */}
                            <div>
                                <label className="font-semibold">Tür *</label>
                                <select
                                    name="type"
                                    value={values.type}
                                    onChange={(e) =>
                                        setFieldValue("type", e.target.value)
                                    }
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="villa">Araç</option>
                                    {/* <option value="bungalov">Bungalov</option>
                                    <option value="yat">Yat</option> */}
                                </select>
                                <ErrorMessage
                                    name="type"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Bölge */}
                            <div>
                                <RegionSelect defaultRegion={defaultRegion} />
                                <ErrorMessage
                                    name="region_id"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Ana Başlık */}
                            <div>
                                <label className="font-semibold">
                                    Ana Başlık *
                                </label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={values.main_title}
                                    onChange={(event, editor) =>
                                        setFieldValue(
                                            "main_title",
                                            editor.getData(),
                                        )
                                    }
                                    config={{
                                        toolbar: [
                                            "bold",
                                            "italic",
                                            "link",
                                            "undo",
                                            "redo",
                                            "numberedList",
                                            "bulletedList",
                                        ],
                                    }}
                                />
                                <ErrorMessage
                                    name="main_title"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Alternatif Başlıklar */}
                            <FieldArray name="titles">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">
                                            Alternatif Başlıklar
                                        </label>
                                        {values.titles.map((title, index) => (
                                            <div key={index} className="mt-3">
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={title}
                                                    onChange={(e, editor) =>
                                                        setFieldValue(
                                                            `titles.${index}`,
                                                            editor.getData(),
                                                        )
                                                    }
                                                    config={{
                                                        toolbar: [
                                                            "bold",
                                                            "italic",
                                                            "link",
                                                            "undo",
                                                            "redo",
                                                        ],
                                                    }}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    {index > 0 ? (
                                                        <IoRemoveCircleOutline
                                                            onClick={() =>
                                                                remove(index)
                                                            }
                                                            className="text-red-500 cursor-pointer text-xl"
                                                        />
                                                    ) : (
                                                        <IoAddCircleOutline
                                                            onClick={() =>
                                                                push("")
                                                            }
                                                            className="text-green-500 cursor-pointer text-xl"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>

                            {/* Ana Açıklama */}
                            <div>
                                <label className="font-semibold">
                                    Ana Açıklama *
                                </label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={values.main_description}
                                    onChange={(e, editor) =>
                                        setFieldValue(
                                            "main_description",
                                            editor.getData(),
                                        )
                                    }
                                    config={{
                                        toolbar: [
                                            "bold",
                                            "italic",
                                            "link",
                                            "blockQuote",
                                            "numberedList",
                                            "bulletedList",
                                            "undo",
                                            "redo",
                                        ],
                                    }}
                                />
                                <ErrorMessage
                                    name="main_description"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Ek Açıklamalar */}
                            <FieldArray name="descriptions">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">
                                            Ek Açıklamalar
                                        </label>
                                        {values.descriptions.map(
                                            (desc, index) => (
                                                <div
                                                    key={index}
                                                    className="mt-3"
                                                >
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={desc}
                                                        onChange={(e, editor) =>
                                                            setFieldValue(
                                                                `descriptions.${index}`,
                                                                editor.getData(),
                                                            )
                                                        }
                                                        config={{
                                                            toolbar: [
                                                                "bold",
                                                                "italic",
                                                                "link",
                                                                "undo",
                                                                "redo",
                                                                "numberedList",
                                                                "bulletedList",
                                                            ],
                                                        }}
                                                    />
                                                    <div className="flex justify-end mt-2">
                                                        {index > 0 ? (
                                                            <IoRemoveCircleOutline
                                                                onClick={() =>
                                                                    remove(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 cursor-pointer text-xl"
                                                            />
                                                        ) : (
                                                            <IoAddCircleOutline
                                                                onClick={() =>
                                                                    push("")
                                                                }
                                                                className="text-green-500 cursor-pointer text-xl"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </FieldArray>

                            {/* Canonical URL */}
                            <div>
                                <label className="font-semibold">
                                    Canonical URL
                                </label>
                                <input
                                    type="text"
                                    value={values.canonical_url}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "canonical_url",
                                            e.target.value,
                                        )
                                    }
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="font-semibold">
                                    Anahtar Kelimeler
                                </label>
                                <input
                                    type="text"
                                    value={values.keywords}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "keywords",
                                            e.target.value,
                                        )
                                    }
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            {/* Görsel + Önizleme */}
                            <div>
                                <label className="font-semibold">
                                    Görsel (OG Image)
                                </label>

                                {previewUrl && (
                                    <div className="mb-2">
                                        <img
                                            src={previewUrl}
                                            alt="Mevcut Görsel"
                                            className="w-48 h-auto rounded border shadow-sm"
                                        />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.currentTarget.files[0];
                                        if (file) {
                                            setFieldValue("image", file);
                                            const newPreview =
                                                URL.createObjectURL(file);
                                            setPreviewUrl(newPreview);
                                        }
                                    }}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            {/* Butonlar */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => window.history.back()}
                                >
                                    Geri Dön
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                >
                                    {isSubmitting
                                        ? "Kaydediliyor..."
                                        : "Kaydet"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SeoEdit;
