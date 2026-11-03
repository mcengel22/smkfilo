import React from "react";
import {Link} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {ROUTES} from "../../../../../../Libs/Routes/config";
import {useAttr} from "../../../../../../ServerSide/Hooks/useAttr";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {toast} from 'react-toastify';
import Swal from 'sweetalert2'; // SweetAlert2 import edildi
const RulesList = () => {
    const {t} = useTranslation();
    const {setRules} = useAttr();
    const {deleteAttr} = useAttr();
    const rules = useSelector(state => state.attr.rules)
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const data = await setRules(); // burada da useAttr içinden gelen fonksiyonu çağırıyoruz
            } catch (err) {
                console.error("Özellikler çekilemedi 😢", err);
            }
        };

        fetchRules();
    }, []);
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
                toast.success('Başarıyla silindi! 🎉'); // Başarı mesajı

                // Silme işlemi sonrası özellikleri tekrar çek
                await setRules(); // Silme sonrası veriyi tekrar çek
            } catch (error) {
                console.error('Silme işlemi sırasında hata oluştu:', error);
                Swal.fire('Hata!', 'Silme işlemi sırasında bir sorun oluştu.', 'error');
            }
        } else {
            console.log('Silme işlemi iptal edildi.');
        }
    };

    return (
        <div>
            <div className="title">
                <h1>{t('Kural Yönetimi')}</h1>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <i className="icon search"></i>
                        <input type="text" id="searchInput" placeholder="İlan Tiplerini Arayın"/>
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
                                {rules.map((rule) => (
                                    <tr key={rule.id}>

                                        <td>{rule.title}</td>
                                        <td>{Array.isArray(rule.post_type) ? rule.post_type.join(', ') : String(rule.post_type)}</td>
                                        {/* varsa model listesi */}
                                        <td className="actions">
                                            <div className="flex">
                                                <button className="btn-icon" title="Düzenle">
                                                    <Link to={ROUTES.UI.ATTREDIT + "/" + rule.slug}>
                                                        <i className="icon edit"></i>
                                                    </Link>
                                                </button>
                                                <button
                                                    className="btn-icon delete"
                                                    title="Sil"
                                                    onClick={() => handleDelete(rule.id)} // Buton tıklanırsa handleDelete çağrılır
                                                >
                                                    <i className="icon trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default RulesList;
