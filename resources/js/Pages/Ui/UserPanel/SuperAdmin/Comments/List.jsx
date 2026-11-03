import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { useComment } from "@/ServerSide/Hooks/useComment";
import { usePost } from "@/ServerSide/Hooks/usePost";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Comments = () => {
    const { t } = useTranslation();
    const { getComment, rejectComment, approveComment, deleteComment } =
        useComment(); // ✅ delete eklendi
    const { setPostTypes } = usePost();
    const comments = useSelector((state) => state.comment.comments);
    const [posts, setPosts] = useState([]);
    const [filtered, setFiltered] = useState(false);

    // 🔃 İlk açılışta yorumları getir
    useEffect(() => {
        const fetchComments = async () => {
            try {
                await getComment();
                setFiltered(false);
            } catch (err) {
                toast.error(t("Yorumlar alınamadı"));
            }
        };

        fetchComments();
    }, []);

    // 📦 Model değişince ilanları getir
    const handlePostTypeChange = async (e, setFieldValue) => {
        const selectedType = e.target.value;
        setFieldValue("type", selectedType);
        setFieldValue("id", "");

        if (!selectedType) {
            setPosts([]);
            return;
        }

        try {
            const result = await setPostTypes(selectedType);
            setPosts(result);
        } catch (error) {
            toast.error(t("İlanlar getirilemedi"));
        }
    };

    // 🎯 Yorum durum badge'i
    const durumBadge = (status) => {
        switch (status) {
            case "approved":
                return (
                    <span className="text-green-500 font-semibold">
                        {t("Onaylanmış")}
                    </span>
                );
            case "rejected":
                return (
                    <span className="text-red-500 font-semibold">
                        {t("Reddedilmiş")}
                    </span>
                );
            default:
                return (
                    <span className="text-gray-500 font-semibold">
                        {t("Beklemede")}
                    </span>
                );
        }
    };
    return (
        <div>
            <div className="title mb-4">
                <h1>{t("Yorumlar")}</h1>
            </div>

            {/* 🔍 Filtreleme */}
            <div className="card mb-3">
                <div className="card-body">
                    <Formik
                        initialValues={{ type: "", id: "" }}
                        onSubmit={async (values) => {
                            try {
                                if (values.id) {
                                    await getComment(values.id);
                                    setFiltered(true);
                                } else if (!values.type) {
                                    await getComment();
                                    setFiltered(false);
                                } else {
                                    toast.warning(t("Lütfen bir ilan seçin"));
                                }
                            } catch (err) {
                                toast.error(t("Bu ilana ait yorum bulunamadı"));
                            }
                        }}
                    >
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="grid lg:grid-cols-12 gap-2 mb-2">
                                    <div className="form-group col-span-5">
                                        <label htmlFor="type">
                                            {t("Model Seç")}
                                        </label>
                                        <Field
                                            as="select"
                                            name="type"
                                            className="w-full"
                                            onChange={(e) =>
                                                handlePostTypeChange(
                                                    e,
                                                    setFieldValue,
                                                )
                                            }
                                        >
                                            <option value="">
                                                {t("Model Seçin")}
                                            </option>
                                            <option value="villa">
                                                {t("Araç")}
                                            </option>
                                            {/* <option value="bungalow">{t("Bungalov")}</option>
                                            <option value="boat">{t("Yat")}</option> */}
                                        </Field>
                                    </div>

                                    <div className="form-group col-span-5">
                                        <label htmlFor="id">
                                            {t("İlan Seç")}
                                        </label>
                                        <Field
                                            as="select"
                                            name="id"
                                            className="w-full"
                                        >
                                            <option value="">
                                                {t("İlan Seçin")}
                                            </option>
                                            {posts.map((post) => (
                                                <option
                                                    key={post.id}
                                                    value={post.id}
                                                >
                                                    {post.title ||
                                                        `${t("İlan")} #${post.id}`}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>

                                    <div className="form-actions col-span-2 h-10 mt-4">
                                        <button
                                            type="submit"
                                            className="save-btn"
                                        >
                                            <span>{t("Yorumları Getir")}</span>
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

            {/* 💬 Yorum Listesi */}
            <div className="card">
                <div className="card-body">
                    {comments && comments.length > 0 ? (
                        comments.map((yorum) => (
                            <div
                                key={yorum.id}
                                className="comment p-4 border border-gray-300 rounded-md mb-2 shadow-sm"
                            >
                                <p className="font-bold">
                                    {yorum.user
                                        ? `${yorum.user.name} ${yorum.user.surname}`
                                        : t("Bilinmeyen Kullanıcı")}
                                </p>
                                <p className="text-sm">{yorum.comment}</p>
                                <p className="text-sm font-bold">
                                    {t("Durum")}: {durumBadge(yorum.status)}
                                </p>
                                <div className="flex mt-2 space-x-2">
                                    {yorum.status !== "approved" && (
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-xs font-semibold"
                                            onClick={async () => {
                                                const confirmed =
                                                    await Swal.fire({
                                                        title: t("Emin misin?"),
                                                        text: t(
                                                            "Bu yorumu onaylamak istiyor musun?",
                                                        ),
                                                        icon: "question",
                                                        showCancelButton: true,
                                                        confirmButtonText:
                                                            t("Evet"),
                                                        cancelButtonText:
                                                            t("Hayır"),
                                                    });

                                                if (confirmed.isConfirmed) {
                                                    try {
                                                        await approveComment(
                                                            yorum.id,
                                                        );
                                                        await getComment();
                                                        toast.success(
                                                            t(
                                                                "Yorum onaylandı",
                                                            ),
                                                        );
                                                    } catch {
                                                        toast.error(
                                                            t(
                                                                "Onaylama işlemi başarısız",
                                                            ),
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            {t("Onayla")}
                                        </button>
                                    )}
                                    {yorum.status !== "rejected" && (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-xs font-semibold"
                                            onClick={async () => {
                                                const confirmed =
                                                    await Swal.fire({
                                                        title: t("Emin misin?"),
                                                        text: t(
                                                            "Bu yorumu reddetmek istiyor musun?",
                                                        ),
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText:
                                                            t("Evet"),
                                                        cancelButtonText:
                                                            t("Hayır"),
                                                    });

                                                if (confirmed.isConfirmed) {
                                                    try {
                                                        await rejectComment(
                                                            yorum.id,
                                                        );
                                                        await getComment();
                                                        toast.success(
                                                            t(
                                                                "Yorum reddedildi",
                                                            ),
                                                        );
                                                    } catch {
                                                        toast.error(
                                                            t(
                                                                "Reddetme işlemi başarısız",
                                                            ),
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            {t("Reddet")}
                                        </button>
                                    )}
                                    <button
                                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-xs font-semibold"
                                        onClick={async () => {
                                            const confirmed = await Swal.fire({
                                                title: t("Emin misin?"),
                                                text: t(
                                                    "Bu yorumu silmek istiyor musun?",
                                                ),
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonText:
                                                    t("Evet, sil"),
                                                cancelButtonText: t("Hayır"),
                                            });

                                            if (confirmed.isConfirmed) {
                                                try {
                                                    await deleteComment(
                                                        yorum.id,
                                                    ); // 🧨 Hook'tan silme
                                                    await getComment(); // ♻️ Listeyi yenile
                                                    toast.success(
                                                        t("Yorum silindi"),
                                                    );
                                                } catch {
                                                    toast.error(
                                                        t(
                                                            "Silme işlemi başarısız",
                                                        ),
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        {t("Sil")}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm">
                            {filtered
                                ? t("Bu ilana ait yorum bulunmamaktadır")
                                : t("Henüz yorum yok")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comments;
