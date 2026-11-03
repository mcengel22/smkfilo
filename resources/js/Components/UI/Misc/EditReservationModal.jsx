import React, { useState } from "react";
import { useReservation } from "../../../ServerSide/Hooks/useReservation";
import { toast } from "react-toastify";

const EditReservationModal = ({ reservation, onClose, onUpdated }) => {
    const { updateReservation } = useReservation();

    const [form, setForm] = useState({
        id: reservation.id,
        post_id: reservation.post_id || reservation.postId || 3, // fallback
        code: reservation.code,
        title: reservation.title,
        slug: reservation.slug,
        customer: reservation.customer,
        price: reservation.price,
        status: reservation.status,
        state: reservation.state,
        // type: reservation.type,
        start_date: reservation.startDate,
        end_date: reservation.endDate,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const formatDateForMysql = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().slice(0, 19).replace("T", " ");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            post_id: parseInt(form.post_id),
            start_date: formatDateForMysql(form.start_date),
            end_date: formatDateForMysql(form.end_date),
            guest: {
                first_name: "Ziyaretçi",
                last_name: "Kullanıcı",
                email: "ziyaretci@example.com",
            },
            payment_method: "manual", // dummy default
        };

        if (new Date(payload.end_date) <= new Date(payload.start_date)) {
            toast.error("Bitiş tarihi başlangıçtan sonra olmalı ⏰");
            return;
        }

        try {
            const response = await updateReservation(form.id, payload);
            if (response?.data) {
                onUpdated(response.data);
                onClose();
            }
        } catch {
            toast.error("Güncelleme başarısız ❌");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <h2 className="text-xl font-semibold mb-4">Rezervasyonu Düzenle</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-600">Başlangıç Tarihi</label>
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={form.start_date ? form.start_date.slice(0, 16) : ""}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Bitiş Tarihi</label>
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={form.end_date ? form.end_date.slice(0, 16) : ""}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-600">Durum (status)</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            >
                                <option value="pending">Bekliyor</option>
                                <option value="confirmed">Onaylandı</option>
                                <option value="canceled">İptal</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Aşama (state)</label>
                            <select
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            >
                                <option value="waiting">Bekliyor</option>
                                <option value="active">Konaklıyor</option>
                                <option value="finished">Tamamlandı</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-600">Fiyat</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        {/*<div>*/}
                        {/*    <label className="text-sm text-gray-600">Tür (type)</label>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        name="type"*/}
                        {/*        value={form.type}*/}
                        {/*        onChange={handleChange}*/}
                        {/*        className="border rounded p-2 w-full"*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Kapat
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReservationModal;
