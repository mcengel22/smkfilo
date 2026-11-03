'use client';
import React, { useState, useEffect, useMemo, useCallback } from "react";

const GalleryModal = ({ images = [], isOpen, onClose }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    const allImages = useMemo(
        () => images.flatMap(category => category?.images ?? []),
        [images]
    );

    const handleImageError = useCallback((e, originalPath) => {
        const target = e.currentTarget;
        if (target.src.includes("no-image.jpg")) return;

        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && originalPath) {
            const cleanPath = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            target.src = "/img/no-image.jpg";
        }
    }, []);

    if (!isOpen) return null;

    const openLightbox = (index) => {
        setCurrentImage(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center p-6 overflow-auto z-[9999]">

            {/* ✅ HER ZAMAN ÜSTTE, HER ZAMAN TIKLANIR */}
            <div className="fixed top-4 left-4 z-[10001] pointer-events-auto">
                <button
                    onClick={() => {
                        // lightbox açıksa önce kapat, sonra modalı kapat (istersen direkt onClose da olur)
                        if (lightboxOpen) setLightboxOpen(false);
                        onClose?.();
                    }}
                    className="text-white flex items-center text-lg bg-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition font-semibold"
                >
                    <i className="icon chevron-left"></i> Geri Dön
                </button>
            </div>

            <div className="content max-w-6xl w-full bg-white p-6 rounded-lg shadow-xl z-50 relative mt-14">
                <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Fotoğraf Turu</h3>

                {images.map((category, catIndex) => (
                    <div key={catIndex} className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">{category.title}</h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {(category.images ?? []).map((image, imgIndex) => {
                                const globalIndex =
                                    images.slice(0, catIndex).reduce((acc, cur) => acc + (cur.images?.length ?? 0), 0) + imgIndex;

                                return (
                                    <div
                                        key={imgIndex}
                                        className="cursor-pointer transform hover:scale-105 transition"
                                        onClick={() => openLightbox(globalIndex)}
                                    >
                                        <img
                                            src={image.media_url ?? "/img/no-image.jpg"}
                                            alt={image.media_alt}
                                            title={image.media_title}
                                            width={150}
                                            height={150}
                                            className="w-[150px] h-[150px] object-cover rounded-lg shadow-md"
                                            loading="lazy"
                                            onError={(e) => handleImageError(e, image.media_url)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white text-3xl bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition z-[10002]"
                    >
                        <i className="icon xmark"></i>
                    </button>

                    <div className="relative flex items-center">
                        <button
                            onClick={() => setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                            className="absolute left-6 text-white text-4xl p-3 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition z-[10002]"
                        >
                            <i className="icon chevron-left"></i>
                        </button>

                        <img
                            key={currentImage}
                            src={allImages[currentImage]?.media_url ?? "/img/no-image.jpg"}
                            alt={allImages[currentImage]?.media_alt}
                            title={allImages[currentImage]?.media_title}
                            width={800}
                            height={500}
                            className="rounded-lg shadow-xl max-w-[80vw] max-h-[80vh] object-contain"
                            onError={(e) => handleImageError(e, allImages[currentImage]?.media_url)}
                        />

                        <button
                            onClick={() => setCurrentImage((prev) => (prev + 1) % allImages.length)}
                            className="absolute right-6 text-white text-4xl p-3 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition z-[10002]"
                        >
                            <i className="icon chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryModal;
