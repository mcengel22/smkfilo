import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import { apiService } from "../../../../../ServerSide/Load";
import { API_CONFIG } from "../../../../../ServerSide/EndPoints";
import { useCoupon } from "../../../../../ServerSide/Hooks/useCoupon";

const CouponEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const location = useLocation();
    const { getCoupon, updateCoupon } = useCoupon();

    // Kupon ID'sini birden fazla kaynaktan tespit et (route param, query, state, path)
    const queryId = useMemo(
        () => new URLSearchParams(location.search).get("id"),
        [location.search],
    );
    const stateId = useMemo(() => {
        const s = location?.state || {};
        return s?.id || s?.couponId || s?.coupon?.id || null;
    }, [location.state]);
    const pathId = useMemo(() => {
        const parts = (location.pathname || "").split("/").filter(Boolean);
        // Sondaki sayısal segmenti id olarak al
        const last = parts[parts.length - 1];
        return /^\d+$/.test(last) ? last : null;
    }, [location.pathname]);
    const anyPathId = useMemo(() => {
        const parts = (location.pathname || "").split("/").filter(Boolean);
        const found = [...parts].reverse().find((seg) => /^\d+$/.test(seg));
        return found || null;
    }, [location.pathname]);
    const couponId = id || queryId || stateId || pathId || anyPathId || null;

    const [type, setType] = useState("");
    const [posts, setPosts] = useState([]);
    const [selectedPostIds, setSelectedPostIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Kupon detaylarını ve mevcut atamaları getir
    useEffect(() => {
        const load = async () => {
            if (!couponId) return;
            try {
                setLoading(true);
                const coupon = await getCoupon(couponId);
                const assigned =
                    coupon?.data?.post_ids ||
                    coupon?.data?.posts?.map((p) => p.id) ||
                    [];
                setSelectedPostIds(assigned);

                const detectedType = coupon?.data?.post_type || "";
                if (detectedType) setType(detectedType);
            } catch (e) {
                console.error("Kupon verisi yüklenirken hata:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [couponId]);

    // Type değişince ilgili ilanları getir
    useEffect(() => {
        const fetchByType = async () => {
            if (!type) return;
            try {
                setLoading(true);
                const res = await apiService.get(
                    `${API_CONFIG.ENDPOINTS.POST.TYPE}/${type}`,
                );
                const list = res?.data?.data || res?.data || [];
                setPosts(list);
            } catch (e) {
                console.error("İlanlar yüklenirken hata:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchByType();
    }, [type]);

    // Checkbox seçimi
    const handleCheckboxChange = (postId) => {
        setSelectedPostIds((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId],
        );
    };

    // Form submit
    const handleSubmit = async () => {
        if (!couponId) {
            console.warn("Kupon ID bulunamadı");
            return;
        }
        if (!type) {
            return;
        }
        try {
            setSaving(true);
            const payload = { post_ids: selectedPostIds, post_type: type };
            await updateCoupon(couponId, payload);
        } catch (err) {
        } finally {
            setSaving(false);
        }
    };

    const postLabel = useMemo(
        () => (p) => p?.title || p?.name || `#${p?.id}`,
        [],
    );

    return (
        <div className="coupon-edit-page">
            <div className="title mb-4">
                <h1 className="text-xl font-bold">{t("Kupon Yönetimi")}</h1>
                <span className="text-gray-500">{t("Kupon Düzenle")}</span>
            </div>

            <div className="flex flex-wrap gap-4">
                {/* Sol Kolon */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card bg-white shadow-md rounded-lg">
                        <div className="card-body p-4">
                            <Formik
                                initialValues={{}}
                                onSubmit={async () => {
                                    await handleSubmit();
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSubmit();
                                        }}
                                    >
                                        {/* Type seçimi */}
                                        <div className="form-group mb-4">
                                            <label
                                                htmlFor="coupon_tur"
                                                className="block mb-1 font-medium"
                                            >
                                                {t("Model")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Field
                                                as="select"
                                                name="coupon_tur"
                                                className="w-full border rounded-md p-2"
                                                value={type}
                                                onChange={(e) =>
                                                    setType(e.target.value)
                                                }
                                            >
                                                <option value="">
                                                    {t("Model Seç")}
                                                </option>
                                                <option value="villa">
                                                    {t("Araç")}
                                                </option>
                                                {/* <option value="bungalov">{t("Bungalov")}</option>
                                                <option value="boat">{t("Yat")}</option> */}
                                            </Field>
                                        </div>

                                        {/* İlan listesi */}
                                        <div className="form-group mb-4">
                                            <label className="block mb-1 font-medium">
                                                {t("İlanlar")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="max-h-80 overflow-auto border rounded-md p-2">
                                                {loading && (
                                                    <div className="text-sm text-gray-500">
                                                        {t("Yükleniyor...")}
                                                    </div>
                                                )}
                                                {!loading &&
                                                    posts?.length === 0 && (
                                                        <div className="text-sm text-gray-500">
                                                            {t(
                                                                "Kayıt bulunamadı.",
                                                            )}
                                                        </div>
                                                    )}
                                                {!loading &&
                                                    posts?.map((p) => (
                                                        <label
                                                            key={p.id}
                                                            className={`cursor-pointer block border px-3 py-2 rounded-md mb-1 transition ${
                                                                selectedPostIds.includes(
                                                                    p.id,
                                                                )
                                                                    ? "bg-blue-200"
                                                                    : "bg-white hover:bg-gray-100"
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={p.id}
                                                                checked={selectedPostIds.includes(
                                                                    p.id,
                                                                )}
                                                                onChange={() =>
                                                                    handleCheckboxChange(
                                                                        p.id,
                                                                    )
                                                                }
                                                                className="mr-2"
                                                            />
                                                            {postLabel(p)}
                                                        </label>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Kaydet Butonu */}
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={saving || loading}
                                                className="save-btn bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                            >
                                                {saving
                                                    ? t("Kaydediliyor...")
                                                    : t("Kaydet")}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

                {/* Sağ Kolon */}
                <div className="w-full lg:w-1/2 px-3">
                    <div className="card bg-white shadow-md rounded-lg">
                        <div className="card-body p-4">
                            <div className="form-group mb-3">
                                <label className="block font-medium">
                                    {t("Kupona Tanımlı İlanlar")}
                                </label>
                            </div>

                            <ul
                                id="assignedShowcases"
                                className="assignedShowcases"
                            >
                                {selectedPostIds.length === 0 && (
                                    <li className="text-sm text-gray-500">
                                        {t("Henüz tanımlı ilan yok.")}
                                    </li>
                                )}
                                {selectedPostIds.map((pid) => {
                                    const found = posts.find(
                                        (p) => p.id === pid,
                                    );
                                    return (
                                        <li
                                            key={pid}
                                            className="mb-1 flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                        >
                                            <div>
                                                <span className="font-bold capitalize">
                                                    {type || "-"}&nbsp;
                                                </span>
                                                <span>
                                                    {found
                                                        ? postLabel(found)
                                                        : `#${pid}`}
                                                </span>
                                            </div>
                                            <div className="actions-btn">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCheckboxChange(
                                                            pid,
                                                        )
                                                    }
                                                    className="delete-btn bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                                                >
                                                    <i className="icon trash"></i>
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponEdit;
