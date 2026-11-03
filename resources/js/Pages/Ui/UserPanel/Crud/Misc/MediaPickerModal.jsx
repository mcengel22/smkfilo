import React, { useState, useEffect, useRef } from "react";
import Dropzone from "react-dropzone";
import Modal from "react-modal";
import { useMedia } from "../../../../../ServerSide/hooks/useMedia";

export default function MediaPickerModal({
                                             isOpen,
                                             onClose,
                                             onSelect,
                                             initialSelectedMedia = [],
                                         }) {
    const [selectedIds, setSelectedIds] = useState(
        new Set(initialSelectedMedia.map((m) => m.id))
    );
    const [activeTab, setActiveTab] = useState("library");
    const [page, setPage] = useState(1);

    const loaderRef = useRef(null);

    const { medias, loading, getMedia, createMedia, pagination } = useMedia();

    /** Modal açıldığında ilk sayfayı getir */
    useEffect(() => {
        if (isOpen) {
            getMedia(1);
            setPage(1);
            setSelectedIds(new Set(initialSelectedMedia.map((m) => m.id)));
            setActiveTab("library");
        }
    }, [isOpen]);

    /** Dosya yükleme */
    const handleDrop = async (files) => {
        try {
            await createMedia(files);
            setPage(1);
            getMedia(1);
            setActiveTab("library");
        } catch (err) {
            console.error(err);
        }
    };

    /** Seçim */
    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    /** Onay */
    const confirmSelection = () => {
        const picked = medias.filter((m) => selectedIds.has(m.id));
        onSelect(picked);
        onClose();
    };

    /** Sonsuz kaydırma (IntersectionObserver) */
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (
                    target.isIntersecting &&
                    !loading &&
                    page < (pagination?.last_page || 1)
                ) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    getMedia(nextPage, true); // append = true
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loaderRef.current, page, loading, pagination]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            ariaHideApp={false}
            contentLabel="Medya Seçici"
            className="mx-auto mt-10 max-w-4xl bg-white p-6 rounded-lg shadow-lg"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Medya Kütüphanesi</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>

            {/* Sekmeler */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`px-4 py-2 -mb-px ${
                        activeTab === "upload"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-600"
                    }`}
                >
                    Yükle
                </button>
                <button
                    onClick={() => setActiveTab("library")}
                    className={`px-4 py-2 -mb-px ${
                        activeTab === "library"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-600"
                    }`}
                >
                    Kütüphane
                </button>
            </div>

            {/* İçerik */}
            {activeTab === "upload" ? (
                <Dropzone onDrop={handleDrop} multiple>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            {loading
                                ? "Yükleniyor..."
                                : "Dosyaları sürükleyin veya tıklayın"}
                        </div>
                    )}
                </Dropzone>
            ) : (
                <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto">
                    {medias.map((media) => (
                        <div
                            key={media.id}
                            onClick={() => toggleSelect(media.id)}
                            className={`relative border rounded cursor-pointer ${
                                selectedIds.has(media.id)
                                    ? "border-blue-500"
                                    : "border-gray-200"
                            }`}
                        >
                            <img
                                src={media.url}
                                alt={media.title}
                                className="w-full h-32 object-cover rounded"
                            />
                            {selectedIds.has(media.id) && (
                                <span className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                                    ✓
                                </span>
                            )}
                        </div>
                    ))}

                    {/* Sonsuz kaydırma gözlem noktası */}
                    <div
                        ref={loaderRef}
                        className="col-span-4 text-center py-4 text-sm text-gray-500"
                    >
                        {loading
                            ? "Yükleniyor..."
                            : pagination?.current_page >= pagination?.last_page
                                ? "Tüm resimler yüklendi."
                                : "Daha fazla yükleniyor..."}
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button onClick={onClose} className="btn mr-2">
                    İptal
                </button>
                <button onClick={confirmSelection} className="btn primary">
                    Seç ({selectedIds.size})
                </button>
            </div>
        </Modal>
    );
}
