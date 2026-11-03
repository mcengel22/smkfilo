import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormikContext } from 'formik';

const CoverImage = ({ image = null, title = null }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (image && typeof image === 'object' && image.url) {
            setPreview(image.url);
        } else if (typeof image === 'string') {
            setPreview(image);
        }
    }, [image]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue("cover_image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const currentSource = preview || image?.media_url;

    const handleImageError = (e) => {
        const target = e.currentTarget;
        if (target.src.includes("no-image.jpg")) return;

        if (currentSource && currentSource.startsWith("blob:")) {
            target.src = "/img/no-image.jpg";
            return;
        }

        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && currentSource) {
            const cleanPath = currentSource.startsWith('/') ? currentSource.substring(1) : currentSource;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            target.src = "/img/no-image.jpg";
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
                <label
                    className="block text-gray-700 font-semibold"
                    htmlFor="cover_image"
                >
                    {title || t("Kapak Görseli")} <span className="text-red-500">*</span>
                </label>
                <input
                    type="file"
                    name="cover"
                    id="cover_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded p-2 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {t("En az 800x600 piksel çözünürlükte bir resim yükleyin")}
                </p>
            </div>
            <div className="mt-4">
                {currentSource ? (
                    <img
                        src={currentSource}
                        alt={t("Kapak Görseli Önizleme")}
                        className="w-32 h-32 object-cover rounded shadow-md"
                        width={128}
                        height={128}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <span>{t("Resim yok")}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoverImage;
