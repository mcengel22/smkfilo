import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import { usePost } from "@/ServerSide/Hooks/usePost.jsx";
import { useShowcase } from "../../../../../ServerSide/Hooks/useShowcase.jsx";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setShowcases } from "@/Repo/Redux/Modules/ShowcaseSlice.jsx";

const ShowcaseEdit = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedType, setSelectedType] = useState("villa");
    const [postList, setPostList] = useState([]);
    const [showcase, setShowcase] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // 🔄 Veri yenileme kontrolü
    const { id } = useParams();
    const { setPostTypes } = usePost();
    const { createShowcaseHasPosts, getShowcase, deleteShowcaseHasPost } =
        useShowcase();
    const { t } = useTranslation();

    // 🧲 Vitrin detaylarını sadece refreshKey değiştiğinde çekiyoruz
    useEffect(() => {
        if (!id) return;

        const fetchShowcase = async () => {
            try {
                const data = await getShowcase(id);
                const rawData = data?.data;

                if (rawData?.posts && rawData?.showcaseshaspost) {
                    const mergedPosts = rawData.posts.map((post, index) => ({
                        ...post,
                        showcaseHasPostId:
                            rawData.showcaseshaspost[index]?.id || null,
                    }));

                    setShowcase({
                        ...rawData,
                        mergedPosts,
                    });
                } else {
                    setShowcase(rawData || null);
                }
            } catch (err) {
                console.error("Vitrin verisi alınamadı 😢", err);
            }
        };

        fetchShowcase();
    }, [id, refreshKey]); // 👈 Sadece refreshKey değişince çalışır

    // 📦 Model seçimine göre postları getir
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await setPostTypes(selectedType);
                setPostList(data || []);
            } catch (err) {
                console.error("İlanlar alınamadı 😢", err);
                setPostList([]);
            }
        };
        fetchPosts();
    }, [selectedType]);

    // ✅ Checkbox kontrolü
    const handleCheckboxChange = (value) => {
        setSelectedOptions((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );
    };

    // 💾 Kaydet
    const handleSubmit = async (values) => {
        try {
            await createShowcaseHasPosts(
                {
                    ...values,
                    post_ids: selectedOptions,
                },
                id,
            );
            toast.success("Vitrin başarıyla güncellendi! 🚀");
            setRefreshKey((prev) => prev + 1); // ✅ Yenile
        } catch (error) {
            console.error("Vitrin güncellenemedi ❌", error);
        }
    };

    // 🗑️ Sil
    const handleDelete = async (showcaseHasPostId) => {
        const result = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu işlem geri alınamaz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "Hayır, iptal et!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await deleteShowcaseHasPost(showcaseHasPostId);
                toast.success("Başarıyla silindi! 🎉");
                setRefreshKey((prev) => prev + 1); // ✅ Yenile
            } catch (error) {
                console.error("Silme hatası:", error);
                Swal.fire("Hata!", "Silinemedi 😢", "error");
            }
        }
    };

    return (
        <div className="showcase">
            <div className="title">
                <h1>Vitrin Yönetimi</h1>
                <span className="sub-title">İlan Ekle</span>
            </div>

            <div className="flex flex-wrap">
                {/* 📝 Sol Panel */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <Formik
                                enableReinitialize
                                initialValues={{ coupon_tur: selectedType }}
                                onSubmit={handleSubmit}
                            >
                                {({ setFieldValue }) => (
                                    <Form>
                                        <div className="form-group">
                                            <label className="block mb-1">
                                                {t("Model")}{" "}
                                                <span className="required">
                                                    *
                                                </span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="coupon_tur"
                                                className="w-full"
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    setSelectedType(value);
                                                    setFieldValue(
                                                        "coupon_tur",
                                                        value,
                                                    );
                                                }}
                                                value={selectedType}
                                            >
                                                <option value="villa">
                                                    {t("Araç")}
                                                </option>
                                                {/* <option value="bungalow">{t('Bungalov')}</option>
                                                <option value="boat">{t('Yat')}</option> */}
                                            </Field>
                                        </div>

                                        {/* ✅ İlan checkboxları */}
                                        <div className="form-group mt-4">
                                            <label className="block mb-1">
                                                {t("İlanlar")}{" "}
                                                <span className="required">
                                                    *
                                                </span>
                                            </label>
                                            <div className="checkbox-group">
                                                {postList.map((post, index) => (
                                                    <label
                                                        key={index}
                                                        className={`cursor-pointer block border px-3 py-2 rounded-md mb-1 ${selectedOptions.includes(post.id) ? "bg-blue-200" : "bg-white"}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            value={post.id}
                                                            checked={selectedOptions.includes(
                                                                post.id,
                                                            )}
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    post.id,
                                                                )
                                                            }
                                                            className="mr-2"
                                                        />
                                                        {post.title}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-actions mt-3">
                                            <button
                                                type="submit"
                                                className="save-btn"
                                            >
                                                {t("Kaydet")}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                {/* 📃 Sağ Panel */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <label className="block text-lg font-semibold text-gray-800">
                                    {t("Vitrin İlanları")}
                                </label>
                            </div>
                            <ul className="assignedShowcases space-y-4">
                                {showcase?.mergedPosts?.length > 0 ? (
                                    showcase.mergedPosts.map((post, index) => (
                                        <li
                                            key={index}
                                            className="group flex items-start gap-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="relative w-14 h-14">
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-xs font-bold rounded-full shadow-md group-hover:scale-105 transition-transform text-center px-1 truncate">
                                                    {post.code}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                            </div>

                                            <button
                                                type="button"
                                                title="Sil"
                                                onClick={() => {
                                                    if (
                                                        post.showcaseHasPostId
                                                    ) {
                                                        handleDelete(
                                                            post.showcaseHasPostId,
                                                        );
                                                    } else {
                                                        console.error(
                                                            "Silinecek id bulunamadı!",
                                                        );
                                                    }
                                                }}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
                                            >
                                                🗑️
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-400 text-center py-5">
                                        {t("Henüz bir vitrin eklenmedi.")}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseEdit;
