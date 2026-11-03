import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ROUTES } from "../../../../../../Libs/Routes/config";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // SweetAlert2 import edildi
import { useAttr } from "../../../../../../ServerSide/Hooks/useAttr"; // Hook'u import ettik
const NearbyList = () => {
    const { t } = useTranslation();
    const { setNears, deleteAttr } = useAttr();
    const nears = useSelector(state => state.attr.nears);

    // Özellikleri sadece bir kez çekme işlemi
    useEffect(() => {
        const fetchNears = async () => {
            try {
                await setNears(); // Veriyi çekme
            } catch (err) {
                console.error("Markalar çekilemedi 😢", err);
            }
        };

        fetchNears();
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
                await setNears(); // Silme sonrası veriyi tekrar çek
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
                <h1>{t('Markalar Yönetimi')}</h1>
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
                                        <th>{t('İşlemler')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nears.length > 0 ? (
                                        nears.map((near) => (
                                            <tr key={near.id}>
                                                <td>{near.title}</td>
                                                <td className="actions">
                                                    <div className="flex">
                                                        <button className="btn-icon" title="Düzenle">
                                                            <Link to={ROUTES.UI.ATTREDIT + "/" + near.slug}>
                                                                <i className="icon edit"></i>
                                                            </Link>
                                                        </button>
                                                        <button

                                                            className="btn-icon delete"
                                                            title="Sil"
                                                            onClick={() => handleDelete(near.id)} // Buton tıklanırsa handleDelete çağrılır
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
}


export default NearbyList;
