'use client';
import React, { useState } from "react";
import GalleryModal from "./GalleryModal";

const Gallery = ({ gallery, cover }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // --- RESİM HATA YÖNETİMİ FONKSİYONU ---
    const handleImageError = (e, originalPath) => {
        const target = e.currentTarget;

        // Eğer resim zaten 'no-image.jpg' ise döngüye girmesin
        if (target.src.includes("no-image.jpg")) return;

        // Şu anki denenen kaynak 'benimtatilcim.com' içeriyor mu?
        const isAlreadyRemote = target.src.includes("benimtatilcim.com");

        if (!isAlreadyRemote && originalPath) {
            // SENARYO 1: Kendi sunucunda/localde bulamadı -> benimtatilcim.com'a bak
            const cleanPath = originalPath.startsWith('/') ? originalPath.substring(1) : originalPath;
            target.src = `https://benimtatilcim.com/${cleanPath}`;
        } else {
            // SENARYO 2: Orada da yoksa -> No Image göster
            target.src = "/img/no-image.jpg";
        }
    };
    // ---------------------------------------

    return (
        <>
            <div className="flex flex-wrap">
                {/* Sol Büyük Görsel */}
                <div className="w-full lg:w-1/2 px-1">
                    <div className="cursor-pointer img-wrapper" onClick={openModal}>
                        {/* --- KAPAK RESMİ DÜZENLEMESİ --- */}
                        <img
                            src={
                                cover?.media_url
                                    ? (cover.media_url.startsWith("http")
                                        ? cover.media_url
                                        : cover.media_url) // İlk deneme: Olduğu gibi
                                    : "/img/no-image.jpg"
                            }
                            alt={cover?.media_alt}
                            title={cover?.media_title}
                            width={800}
                            height={400}
                            className="rounded-md big-img object-cover"
                            loading="lazy"
                            onError={(e) => handleImageError(e, cover?.media_url)}
                        />
                        {/* ------------------------------- */}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 px-1">
                    <div className="flex flex-wrap">
                        {gallery && gallery.flatMap(media => media.images).slice(0, 4).map((image, i) => (
                            <div key={i} className="w-1/2 cursor-pointer img-wrapper" onClick={openModal}>
                                {/* --- GALERİ RESİMLERİ DÜZENLEMESİ --- */}
                                <img
                                    src={
                                        image?.media_url
                                            ? (image.media_url.startsWith("http")
                                                ? image.media_url
                                                : image.media_url) // İlk deneme: Olduğu gibi
                                            : "/img/no-image.jpg"
                                    }
                                    alt={image?.media_alt}
                                    title={image?.media_title}
                                    className="rounded-md other-img object-cover"
                                    width={400}
                                    height={200}
                                    loading="lazy"
                                    onError={(e) => handleImageError(e, image?.media_url)}
                                />
                                {/* ------------------------------------ */}
                            </div>
                        ))}
                    </div>

                    {/* Tüm Fotoğraflar Butonu */}
                    <div className="mt-4 text-center all-photo">
                        <button
                            className="bg-gray-200 text-black py-2 px-4 rounded-md"
                            onClick={openModal}
                        >
                            <i className="icon all"></i>
                            Tüm Fotoğraflar
                        </button>
                    </div>
                </div>
            </div>
            { gallery && <GalleryModal images={gallery} isOpen={isModalOpen} onClose={closeModal} /> }

        </>
    );
};

export default Gallery;
