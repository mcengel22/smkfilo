import React from "react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import RegionSelect from "@/Pages/Ui/UserPanel/Crud/Misc/RegionSelect.jsx";
import { useBlog } from "@/ServerSide/Hooks/useBlog";
import { useNavigate } from "react-router-dom"; // ✅ üstte eklemeyi unutma
const BlogCreate = () => {
    const { t } = useTranslation();
    const { createBlog } = useBlog();
    const navigate = useNavigate(); // ✅ burada olacak (component seviyesi)
    const initialValues = {
        title: "",
        content: "",
        type: "",           // enum: villa | bungalov | yat
        region_id: "",
        image: null,
        sections: [{ title: "", content: "" }],
        faq_title: "",
        faqs: [{ q: "", a: "" }],
        keywords: [""],
        backlinks: [""],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Başlık zorunlu"),
        content: Yup.string().required("İçerik zorunlu"),
        type: Yup.string().oneOf(["villa", "bungalov", "yat"]).required("Tür zorunlu"),
        region_id: Yup.mixed().nullable(),
        image: Yup.mixed().nullable(),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const formData = new FormData();

            if (values.image) formData.append("image", values.image);

            // DİĞER ALANLAR
            Object.entries(values).forEach(([key, value]) => {
                if (key === "image") return;

                if (Array.isArray(value) || typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const response = await createBlog(formData);



            // ✅ navigate burada çalışır çünkü hook dışarıda tanımlandı
            setTimeout(() => {
                navigate("/Panel/Blog");
            }, 1500);

            resetForm();
        } catch (err) {
            console.error("🔥 [BLOG CREATE ERROR]:", err);
        }
    };

    return (
        <div className="blog-create p-6">
            <div className="title mb-6">
                <h1 className="text-2xl font-bold">{t("Blog Kaydı Oluştur")}</h1>
                <p className="text-gray-500">{t("Yeni blog yazısı ekleyin")}</p>
            </div>

            <div className="card bg-white shadow-md rounded-lg p-6">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="grid gap-6">
                            {/* Başlık */}
                            <div>
                                <label className="font-semibold">Başlık *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={(e) => setFieldValue("title", e.target.value)}
                                    className="border rounded p-2 w-full"
                                    placeholder="Blog başlığı"
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Tür (ENUM) */}
                            <div>
                                <label className="font-semibold">Tür *</label>
                                <select
                                    name="type"
                                    value={values.type}
                                    onChange={(e) => setFieldValue("type", e.target.value)}
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="villa">Araç</option>
                                </select>
                                <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Bölge */}
                            <div>
                                <RegionSelect
                                    value={values.region_id}
                                    onChange={(val) => setFieldValue("region_id", val)}
                                />
                            </div>

                            {/* Ana İçerik */}
                            <div>
                                <label className="font-semibold">Ana İçerik *</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={values.content}
                                    onChange={(e, editor) => setFieldValue("content", editor.getData())}
                                />
                                <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
                            </div>

                            {/* Bölümler */}
                            <FieldArray name="sections">
                                {({ push, remove }) => (
                                    <div>
                                        <label className="font-semibold">Ek Bölümler</label>
                                        {values.sections.map((section, index) => (
                                            <div key={index} className="border p-3 mt-3 rounded">
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => setFieldValue(`sections.${index}.title`, e.target.value)}
                                                    className="border rounded p-2 w-full mb-2"
                                                    placeholder="Bölüm Başlığı"
                                                />
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={section.content}
                                                    onChange={(e, editor) =>
                                                        setFieldValue(`sections.${index}.content`, editor.getData())
                                                    }
                                                />
                                                <div className="flex justify-end mt-2">
                                                    {index > 0 ? (
                                                        <IoRemoveCircleOutline
                                                            onClick={() => remove(index)}
                                                            className="text-red-500 cursor-pointer text-xl"
                                                        />
                                                    ) : (
                                                        <IoAddCircleOutline
                                                            onClick={() => push({ title: "", content: "" })}
                                                            className="text-green-500 cursor-pointer text-xl"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>

                            {/* SSS */}
                            <div>
                                <label className="font-semibold">Sıkça Sorulan Sorular</label>
                                <input
                                    type="text"
                                    value={values.faq_title}
                                    onChange={(e) => setFieldValue("faq_title", e.target.value)}
                                    className="border rounded p-2 w-full mb-3"
                                    placeholder="SSS Başlığı"
                                />

                                <FieldArray name="faqs">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.faqs.map((faq, index) => (
                                                <div key={index} className="border p-3 rounded mt-2">
                                                    <input
                                                        type="text"
                                                        value={faq.q}
                                                        onChange={(e) => setFieldValue(`faqs.${index}.q`, e.target.value)}
                                                        placeholder="Soru"
                                                        className="border rounded p-2 w-full mb-2"
                                                    />
                                                    <textarea
                                                        value={faq.a}
                                                        onChange={(e) => setFieldValue(`faqs.${index}.a`, e.target.value)}
                                                        placeholder="Cevap"
                                                        className="border rounded p-2 w-full"
                                                    />
                                                    <div className="flex justify-end mt-2">
                                                        {index > 0 ? (
                                                            <IoRemoveCircleOutline
                                                                onClick={() => remove(index)}
                                                                className="text-red-500 cursor-pointer text-xl"
                                                            />
                                                        ) : (
                                                            <IoAddCircleOutline
                                                                onClick={() => push({ q: "", a: "" })}
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
                                        <label className="font-semibold">Anahtar Kelimeler</label>
                                        {values.keywords.map((kw, index) => (
                                            <div key={index} className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={kw}
                                                    onChange={(e) => setFieldValue(`keywords.${index}`, e.target.value)}
                                                    className="border rounded p-2 w-full"
                                                    placeholder="örn: villa kiralama"
                                                />
                                                {index > 0 ? (
                                                    <IoRemoveCircleOutline
                                                        onClick={() => remove(index)}
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
                                        <label className="font-semibold">Backlinkler</label>
                                        {values.backlinks.map((link, index) => (
                                            <div key={index} className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={link}
                                                    onChange={(e) => setFieldValue(`backlinks.${index}`, e.target.value)}
                                                    className="border rounded p-2 w-full"
                                                    placeholder="örn: https://site.com"
                                                />
                                                {index > 0 ? (
                                                    <IoRemoveCircleOutline
                                                        onClick={() => remove(index)}
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

                            {/* Görsel */}
                            <div>
                                <label className="font-semibold">Kapak Görseli</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFieldValue("image", e.currentTarget.files[0])}
                                    className="border rounded p-2 w-full"
                                />
                                {values.image && (
                                    <p className="text-sm mt-1 text-gray-500">Dosya seçildi: {values.image.name}</p>
                                )}
                            </div>

                            {/* Butonlar */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                                >
                                    {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>


        </div>
    );
};

export default BlogCreate;
