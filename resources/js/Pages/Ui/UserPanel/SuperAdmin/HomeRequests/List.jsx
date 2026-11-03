import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useUser } from "../../../../../ServerSide/Hooks/useUser";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const HomeRequestsList = () => {
    const {
        setRequest,
        approveAdminRequest,
        rejectAdminRequest
    } = useUser();

    const users = useSelector(state => state.user.user);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                await setRequest();
            } catch (err) {
                console.error('Admin başvuruları alınırken hata oluştu:', err);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Bu kullanıcıyı admin olarak onaylamak istiyor musunuz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Evet, onayla',
            cancelButtonText: 'Hayır',
        });

        if (result.isConfirmed) {
            try {
                await approveAdminRequest(id); // ✅ API çağrısı
                toast.success('Kullanıcı admin olarak onaylandı ✅');
                await setRequest(); // listeyi güncelle
            } catch (err) {
                Swal.fire('Hata!', 'Onay işlemi sırasında bir hata oluştu.', 'error');
            }
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: 'Bu kullanıcıyı reddetmek istiyor musunuz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, reddet',
            cancelButtonText: 'Hayır',
        });

        if (result.isConfirmed) {
            try {
                await rejectAdminRequest(id); // ✅ API çağrısı
                toast.success('Kullanıcı reddedildi ❌');
                await setRequest(); // listeyi güncelle
            } catch (err) {
                Swal.fire('Hata!', 'Reddetme işlemi sırasında bir hata oluştu.', 'error');
            }
        }
    };

    const adminRequests = Array.isArray(users) ? users : [];

    return (
        <div>
            <div className="title">
                <h1>{t('Admin Başvuruları')}</h1>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="users-content">
                        <div className="table-responsive table-area">
                            <table>
                                <thead>
                                <tr>
                                    <th>{t('ID')}</th>
                                    <th>{t('Ad Soyad')}</th>
                                    <th>{t('E-posta')}</th>
                                    <th>{t('Telefon')}</th>
                                    <th>{t('İstek Durumu')}</th>
                                    <th>{t('İşlemler')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {adminRequests.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name + " " + user.surname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.admin_request_status}</td>
                                        <td className="actions">
                                            <div className="flex">
                                                <button
                                                    className="btn-icon approve"
                                                    title="Onayla"
                                                    onClick={() => handleApprove(user.id)}
                                                >
                                                    <i className="icon check"></i>
                                                </button>
                                                <button
                                                    className="btn-icon reject"
                                                    title="Reddet"
                                                    onClick={() => handleReject(user.id)}
                                                >
                                                    <i className="icon close"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {adminRequests.length === 0 && (
                            <div className="text-center py-5 text-gray-500">
                                {t("Bekleyen başvuru bulunmamaktadır.")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeRequestsList;
