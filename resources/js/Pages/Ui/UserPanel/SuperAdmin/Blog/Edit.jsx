import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useBlog } from "@/ServerSide/Hooks/useBlog";
import RegionSelect from "@/Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ROUTES } from "@/Libs/Routes/config";
import { useNavigate } from "react-router-dom"; // ✅ üstte eklemeyi unutma
const BlogEdit = () => {
    const { t } = useTranslation();
    const { slug } = useParams(); // ✅ Route param slug
    const { getBlog, updateBlog } = useBlog();
    const navigate = useNavigate(); // ✅ yönlendirme hook’u eklendi
    const [initialValues, setInitialValues] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [defaultRegion, setDefaultRegion] = useState(null);
    const [blogId, setBlogId] = useState(null); // ✅ backend’ten gelen id

    const validationSchema = Yup.object({
        title: Yup.string().required("Başlık zorunlu"),
        content: Yup.string().required("İçerik zorunlu"),
        type: Yup.string().required("Tür zorunlu"),
        region_id: Yup.string().nullable(),
        image: Yup.mixed().nullable(),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBlog(slug);
                setBlogId(data.id);

                setInitialValues({
                    title: data.title || "",
                    content: data.content || "",
                    type: data.type || "",
                    region_id: data.region_id ? data.region_id.toString() : "",
                    image: null,
                    sections: data.sections || [{ title: "", content: "" }],
                    faq_title: data.faq_title || "",
                    faqs: data.faqs || [{ q: "", a: "" }],
                    keywords: data.keywords || [""],
                    backlinks: data.backlinks || [""],
                });

                /**
                 * 💡 Region setleme
                 * Backend artık region_name döndürüyor → direkt kullanıyoruz
                 */
                if (data.region_id && data.region_name) {
                    setDefaultRegion({
                        id: data.region_id,
                        name: data.region_name,
                    });
                } else if (data.region && data.region.id) {
                    setDefaultRegion({
                        id: data.region.id,
                        name: data.region.name,
                    });
                }

                // 💡 Görsel önizleme
                if (data.image) {
                    const base = window.location.origin;
                    const imgUrl = data.image.startsWith("http")
                        ? data.image
                        : `${base.replace(/\/$/, "")}${
                              data.image.startsWith("/") ? "" : "/"
                          }${data.image}`;
                    setPreviewUrl(imgUrl);
                }
            } catch (err) {}
        };

        fetchData();

        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [slug]);

    if (!initialValues) {
        return <p className="p-4">{t("Yükleniyor...")}</p>;
    }

    return (
        <div className="blog-edit p-6">
            <div className="title mb-6">
                <h1 className="text-2xl font-bold">
                    {t("Blog Kaydını Düzenle")}
                </h1>
                <p className="text-gray-500">
                    {t("Mevcut blog kaydını güncelleyin")}
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

                            if (values.image)
                                formData.append("image", values.image);

                            Object.entries(values).forEach(([key, value]) => {
                                if (key === "image") return;
                                if (Array.isArray(value)) {
                                    formData.append(key, JSON.stringify(value));
                                } else if (
                                    value !== null &&
                                    value !== undefined
                                ) {
                                    formData.append(key, value);
                                }
                            });

                            if (!blogId) {
                                return;
                            }

                            await updateBlog(blogId, formData);

                            // ✅ Kısa gecikmeyle yönlendirme
                            setTimeout(() => {
                                navigate(ROUTES.UI.BLOG);
                            }, 1500);
                        } catch (error) {
                            console.error("Blog güncelleme hatası:", error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="grid gap-6">
                            {/* Başlık */}
                            <div>
                                <label className="font-semibold">
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    value={values.title}
                                    onChange={(e) =>
                                        setFieldValue("title", e.target.value)
                                    }
                                    className="border rounded p-2 w-full"
                                    placeholder="Blog başlığı"
                                />
                            </div>

                            {/* Tür */}
                            <div>
                                <label className="font-semibold">Tür *</label>
                                <select
                                    value={values.type}
                                    onChange={(e) =>
                                        setFieldValue("type", e.target.value)
                                    }
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="villa">Araç</option>
                                    {/* <option value="bungalov">Bungalov</option>
                                    <option value="yat">Yat</option>
                                    <option value="kampanya">Kampanya</option>
                                    <option value="duyuru">Duyuru</option>
                                    <option value="blog">Blog</option> */}
                                </select>
                                <ErrorMessage
                                    name="type"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Bölge */}
                            <div>
                                <RegionSelect
                                    defaultRegion={defaultRegion}
                                    onChange={(val) =>
                                        setFieldValue("region_id", val)
                                    }
                                />
                                <ErrorMessage
                                    name="region_id"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Ana İçerik */}
                            <div>
                                <label className="font-semibold">
                                    Ana İçerik *
                                </label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={values.content}
                                    onChange={(e, editor) =>
                                        setFieldValue(
                                            "content",
                                            editor.getData(),
                                        )
                                    }
                                />
                                <ErrorMessage
                                    name="content"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* Bölümler */}
                            <FieldArray name="sections">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">
                                            Ek Bölümler
                                        </label>
                                        {values.sections.map(
                                            (section, index) => (
                                                <div
                                                    key={index}
                                                    className="border p-3 mt-3 rounded"
                                                >
                                                    <input
                                                        type="text"
                                                        value={section.title}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `sections.${index}.title`,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="border rounded p-2 w-full mb-2"
                                                        placeholder="Bölüm Başlığı"
                                                    />
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={section.content}
                                                        onChange={(e, editor) =>
                                                            setFieldValue(
                                                                `sections.${index}.content`,
                                                                editor.getData(),
                                                            )
                                                        }
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
                                                                    push({
                                                                        title: "",
                                                                        content:
                                                                            "",
                                                                    })
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

                            {/* SSS */}
                            <div>
                                <label className="font-semibold">
                                    Sıkça Sorulan Sorular
                                </label>
                                <input
                                    type="text"
                                    value={values.faq_title}
                                    onChange={(e) =>
                                        setFieldValue(
                                            "faq_title",
                                            e.target.value,
                                        )
                                    }
                                    className="border rounded p-2 w-full mb-3"
                                    placeholder="SSS Başlığı"
                                />
                                <FieldArray name="faqs">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.faqs.map((faq, index) => (
                                                <div
                                                    key={index}
                                                    className="border p-3 rounded mt-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={faq.q}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `faqs.${index}.q`,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Soru"
                                                        className="border rounded p-2 w-full mb-2"
                                                    />
                                                    <textarea
                                                        value={faq.a}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `faqs.${index}.a`,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Cevap"
                                                        className="border rounded p-2 w-full"
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
                                                                    push({
                                                                        q: "",
                                                                        a: "",
                                                                    })
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
                            </div>

                            {/* Keywords */}
                            <FieldArray name="keywords">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">
                                            Anahtar Kelimeler
                                        </label>
                                        {values.keywords.map((kw, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 mt-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={kw}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            `keywords.${index}`,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border rounded p-2 w-full"
                                                    placeholder="örn: villa kiralama"
                                                />
                                                {index > 0 ? (
                                                    <IoRemoveCircleOutline
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className="text-red-500 cursor-pointer text-xl"
                                                    />
                                                ) : (
                                                    <IoAddCircleOutline
                                                        onClick={() => push("")}
                                                        className="text-green-500 cursor-pointer text-xl"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>

                            {/* Backlinks */}
                            <FieldArray name="backlinks">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">
                                            Backlinkler
                                        </label>
                                        {values.backlinks.map((link, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 mt-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={link}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            `backlinks.${index}`,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border rounded p-2 w-full"
                                                    placeholder="örn: https://site.com"
                                                />
                                                {index > 0 ? (
                                                    <IoRemoveCircleOutline
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className="text-red-500 cursor-pointer text-xl"
                                                    />
                                                ) : (
                                                    <IoAddCircleOutline
                                                        onClick={() => push("")}
                                                        className="text-green-500 cursor-pointer text-xl"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>

                            {/* Görsel + Önizleme */}
                            <div>
                                <label className="font-semibold">
                                    Kapak Görseli
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

export default BlogEdit;
