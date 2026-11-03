import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePolicies } from "@/ServerSide/Hooks/usePolicies";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const POLICY_TYPES = [
    { label: "Gizlilik Sözleşmesi", value: "gizlilik-sozlesmesi" },
    { label: "İptal Şartları", value: "iptal-sartlari" },
    { label: "Kiralama Sözleşmesi", value: "kiralama-sozlesmesi" },
    { label: "Kullanım Koşulları", value: "kullanim-kosullari" },
    { label: "KVKK", value: "kvkk" },
    { label: "Rıza Metni", value: "riza-metni" },
];

const PoliciesModal = ({ onClose, editItem, onRefresh }) => {
    const { t } = useTranslation();
    const { createPolicy, updatePolicy, getPolicies } = usePolicies();
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        content: "",
    });
    const [existingTypes, setExistingTypes] = useState([]);

    // 🔹 Mevcut politikaları getir
    useEffect(() => {
        const fetchExisting = async () => {
            try {
                const data = await getPolicies();
                setExistingTypes(data.map((p) => p.type));
            } catch (e) {
                console.error("Type kontrolü yapılamadı:", e);
            }
        };
        fetchExisting();
    }, []);

    // 🔹 Düzenleme modunda mevcut veriyi doldur
    useEffect(() => {
        if (editItem) {
            setFormData({
                name: editItem.name || "",
                type: editItem.type || "",
                content: editItem.content || "",
            });
        }
    }, [editItem]);

    // 🔹 Input değişimi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Kayıt / Güncelle
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!editItem && existingTypes.includes(formData.type)) {
                toast.error(t("Bu türde zaten bir kayıt mevcut!"));
                return;
            }

            if (editItem) {
                await updatePolicy(editItem.id, formData);
                toast.success(t("Politika güncellendi"));
            } else {
                await createPolicy(formData);
                toast.success(t("Politika eklendi"));
            }

            onClose();
            onRefresh();
        } catch (error) {
            console.error("❌ İşlem hatası:", error);
            toast.error(t("İşlem başarısız"));
        }
    };

    const availableTypes = editItem
        ? POLICY_TYPES
        : POLICY_TYPES.filter((t) => !existingTypes.includes(t.value));

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* 🔹 Scroll destekli içerik alanı */}
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {editItem ? t("Politika Düzenle") : t("Yeni Politika Ekle")}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* 🔹 Ad */}
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">{t("Ad")}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded p-2 w-full"
                            placeholder="örnek: Gizlilik Sözleşmesi"
                            required
                        />
                    </div>

                    {/* 🔹 Tür */}
                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium">{t("Tür (type)")}</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="border rounded p-2 w-full bg-white"
                            required
                            disabled={!!editItem}
                        >
                            <option value="">{t("Tür Seçin")}</option>
                            {availableTypes.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {availableTypes.length === 0 && !editItem && (
                            <p className="text-sm text-red-500 mt-1">
                                {t("Tüm türlerde kayıt mevcut. Yeni ekleme yapılamaz.")}
                            </p>
                        )}
                    </div>

                    {/* 🔹 CKEditor */}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">{t("İçerik (Editör)")}</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.content}
                            onChange={(event, editor) =>
                                setFormData((prev) => ({ ...prev, content: editor.getData() }))
                            }
                            config={{
                                toolbar: [
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "link",
                                    "bulletedList",
                                    "numberedList",
                                    "blockQuote",
                                    "alignment",
                                    "undo",
                                    "redo",
                                ],
                            }}
                        />
                        <small className="text-gray-400 text-xs">
                            {t("Bu alan HTML olarak kaydedilir.")}
                        </small>
                    </div>

                    {/* 🔹 Butonlar */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            {t("Kapat")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            disabled={!formData.type || availableTypes.length === 0}
                        >
                            {editItem ? t("Güncelle") : t("Kaydet")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PoliciesModal;
