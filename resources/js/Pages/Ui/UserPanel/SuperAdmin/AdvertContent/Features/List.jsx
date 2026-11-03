import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ROUTES } from "../../../../../../Libs/Routes/config";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // SweetAlert2 import edildi
import { useAttr } from "../../../../../../ServerSide/Hooks/useAttr"; // Hook'u import ettik

const FeaturesList = () => {
    const { t } = useTranslation();
    const { setFeatures, deleteAttr } = useAttr();
    const features = useSelector(state => state.attr.features);

    // Özellikleri sadece bir kez çekme işlemi
    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                await setFeatures(); // Veriyi çekme
            } catch (err) {
                console.error("Özellikler çekilemedi 😢", err);
            }
        };

        fetchFeatures();
    }, []); // Boş dizi ile sadece bir kez çalışmasını sağlıyoruz


    // Silme fonksiyonu
    const handleDelete = async (id) => {
        console.log("Silme için gönderilen ID:", id); // ID'yi kontrol et
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'Hayır, iptal et!',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                // Silme işlemine başla
                await deleteAttr(id);
                Swal.fire(
                    'Silindi!',
                    'Özellik başarıyla silindi.',
                    'success'
                );
                toast.success('Başarıyla silindi! 🎉'); // Başarı mesajı

                // Silme işlemi sonrası özellikleri tekrar çek
                await setFeatures(); // Silme sonrası veriyi tekrar çek
            } catch (error) {
                console.error('Silme işlemi sırasında hata oluştu:', error);
                Swal.fire(
                    'Hata!',
                    'Silme işlemi sırasında bir sorun oluştu.',
                    'error'
                );
            }
        } else {
            console.log('Silme işlemi iptal edildi.');
        }
    };


    return (
        <div>
            <div className="title">
                <h1>{t('Özellik Yönetimi')}</h1>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <i className="icon search"></i>
                        <input type="text" id="searchInput" placeholder="İlan Tiplerini Arayın" />
                    </div>
                    <button className="add-user-btn btn btn-primary">
                        <Link to={ROUTES.UI.ATTRADD}>
                            <span>{t('Ekle')}</span>
                        </Link>
                    </button>
                </div>
                <div className="card-body">
                    <div className="users-content">
                        <div className="table-responsive table-area">
                            <table>
                                <thead>
                                <tr>
                                    <th>{t('Ad')}</th>
                                    <th>{t('Model')}</th>
                                    <th>{t('İşlemler')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {features.length > 0 ? (
                                    features.map((feature) => (
                                        <tr key={feature.id}>
                                            <td>{feature.title}</td>
                                            <td>{Array.isArray(feature.post_type) ? feature.post_type.join(', ') : String(feature.post_type)}</td>
                                            <td className="actions">
                                                <div className="flex">
                                                    <button className="btn-icon" title="Düzenle">
                                                        <Link to={ROUTES.UI.ATTREDIT + "/" + feature.slug}>
                                                            <i className="icon edit"></i>
                                                        </Link>
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        title="Sil"
                                                        onClick={() => handleDelete(feature.id)} // Buton tıklanırsa handleDelete çağrılır
                                                    >
                                                        <i className="icon trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">{t('Hiç özellik bulunamadı.')}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesList;
