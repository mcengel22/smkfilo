import React, { useState, useEffect } from "react";
import { Field, useFormikContext } from 'formik';
import { useTranslation } from "react-i18next";
import MediaPickerModal from '../Misc/MediaPickerModal';

const AdvertGallery = ({ vals = [] }) => {
    const { t } = useTranslation();
    const { values, setFieldValue } = useFormikContext();
    const [pickerIndex, setPickerIndex] = useState(null);

    // AdvertGallery içindeki useEffect
    useEffect(() => {
        if (Array.isArray(vals) && vals.length > 0 && (!values.gallery || values.gallery.length === 0)) {
            const initial = vals.map(group => ({
                id: group.id,
                value: group.title,
                image: group.images.map(img => ({
                    id:    img.id,
                    url:   img.media_url,
                    title: img.media_title
                }))
            }));
            setFieldValue('gallery', initial);
        }
    }, [vals, setFieldValue]);

    // --- RESİM HATA YÖNETİMİ FONKSİYONU ---
    const handleImageError = (e, originalPath) => {
        const target = e.currentTarget;

        // Eğer resim zaten 'no-image.jpg' ise döngüye girmesin
        if (target.src.includes("no-image.jpg")) return;

        // Şu anki denenen kaynak 'benimtatilcim.com' içeriyor mu?
        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && originalPath) {
            // SENARYO 1: Kendi sunucunda/localde bulamadı -> benimtatilcim.com'a bak
            // Path başındaki '/' işaretini temizleyelim
            const cleanPath = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            // SENARYO 2: Orada da yoksa -> No Image göster
            target.src = "/img/no-image.jpg";
        }
    };
    // ---------------------------------------

    // Open modal for a repeater index
    const openPicker = (index) => setPickerIndex(index);
    const closePicker = () => setPickerIndex(null);

    const handleSelectImages = (medias) => {
        const updated = [...values.gallery];
        updated[pickerIndex].image = medias.map(m => ({
            id:    m.id,
            url:   m.url, // MediaPicker'dan gelen url genelde local path olur (/storage/...)
            title: m.title
        }));

        setFieldValue('gallery', updated);
        closePicker();
    };

    // Add new category repeater
    const handleAddField = () => {
        const next = [...(values.gallery || [])];
        next.push({ value: '', image: [] });
        setFieldValue('gallery', next);
    };

    return (
        <div className="mt-6 upload-gallery">
            <h2 className="text-xl font-bold text-gray-800">{t('Görsel Ekle')}</h2>

            {values.gallery?.map((item, index) => (
                <div key={index} className="gallery-item grid lg:grid-cols-12 gap-4 mt-2">
                    <div className="col-span-5">
                        <label className="block text-gray-700 font-semibold">{t('Kategori Adı')}</label>
                        <Field
                            name={`gallery[${index}].value`}
                            placeholder={t('Kategori adı girin')}
                            className="border border-gray-300 p-2 rounded mt-1 w-full"
                        />
                    </div>

                    <div className="col-span-5 flex items-end">
                        <button
                            type="button"
                            onClick={() => openPicker(index)}
                            className="btn select-btn w-full"
                        >
                            {t('Resim Seç')}
                        </button>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                const filtered = values.gallery.filter((_, i) => i !== index);
                                setFieldValue('gallery', filtered);
                            }}
                            className="btn delete-btn"
                        >
                            {t('Sil')}
                        </button>
                    </div>

                    <div className="col-span-12 flex preview-img flex-wrap mt-2">
                        {item.image?.map((img, idx) => (
                            // --- GÜNCELLENEN RESİM ALANI ---
                            <img
                                key={idx}
                                src={
                                    (img.url || img.preview)
                                        ? (img.url || img.preview) // İlk deneme: Olduğu gibi (Local path veya Link)
                                        : "/img/no-image.jpg"
                                }
                                alt={`preview-${index}-${idx}`}
                                className="w-32 h-32 object-cover rounded m-1"
                                loading="lazy"
                                onError={(e) => handleImageError(e, img.url || img.preview)}
                            />
                            // -------------------------------
                        ))}
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddField}
                className="btn add-btn mt-4"
            >
                {t('Kategori Ekle')}
            </button>

            <MediaPickerModal
                isOpen={pickerIndex !== null}
                onClose={closePicker}
                onSelect={handleSelectImages}
                initialSelectedMedia={
                    pickerIndex !== null
                        ? values.gallery[pickerIndex].image
                        : []
                }
            />
        </div>
    );
};

export default AdvertGallery;
