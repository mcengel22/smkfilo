import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useContact } from "../../../../../ServerSide/Hooks/useContact.jsx";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const CommunicationList = () => {
    const { t } = useTranslation();
    const { setContacts, deleteContacts } = useContact();
    const contacts = useSelector(state => state.contact.contacts);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                await setContacts();
            } catch (err) {
                console.error("İletişim formları çekilemedi 😢", err);
            }
        };
        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
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
                await deleteContacts(id);
                toast.success('Başarıyla silindi! 🎉');
                await setContacts();
            } catch (error) {
                console.error('Silme sırasında hata oluştu:', error);
                Swal.fire('Hata!', 'Silme başarısız.', 'error');
            }
        }
    };

    const openModal = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <style>
                {`
                    .modal-bg {
                        position: fixed;
                        top: 0; left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                    }
                    .modal-box {
                        background: white;
                        padding: 2rem;
                        border-radius: 12px;
                        width: 90%;
                        max-width: 500px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.3);
                        position: relative;
                    }
                    .modal-box h2 {
                        margin-top: 0;
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                    }
                    .close-btn {
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        background: none;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                        color: #666;
                    }
                `}
            </style>

            <div className="title">
                <h1>{t('İletişim Formları')}</h1>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <i className="icon search"></i>
                        <input type="text" placeholder="Ad, e-posta veya telefon ile ara..." />
                    </div>
                </div>
                <div className="card-body">
                    <div className="users-content">
                        <div className="table-responsive table-area">
                            <table>
                                <thead>
                                <tr>
                                    <th>{t('ID')}</th>
                                    <th>{t('Adı Soyadı')}</th>
                                    <th>{t('Email')}</th>
                                    <th>{t('Telefon')}</th>
                                    <th>{t('Açıklama')}</th>
                                    <th>{t('Tarih')}</th>
                                    <th>{t('İşlemler')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {contacts.length > 0 ? (
                                    contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{contact.id}</td>
                                            <td>{contact.fullname}</td>
                                            <td>{contact.email}</td>
                                            <td>{contact.phone}</td>
                                            <td>{contact.description}</td>
                                            <td>{contact.created_at}</td>
                                            <td className="actions">
                                                <button className="btn-icon delete" title="Sil"
                                                        onClick={() => handleDelete(contact.id)}>
                                                    <i className="icon trash"></i>
                                                </button>
                                                <button className="btn-icon view" title="Görüntüle"
                                                        onClick={() => openModal(contact)}>
                                                    <i className="icon eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">{t('Hiç iletişim formu bulunamadı.')}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedContact && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <button className="close-btn" onClick={closeModal}>✖</button>
                        <h2>{selectedContact.fullname}</h2>
                        <p><strong>Email:</strong> {selectedContact.email}</p>
                        <p><strong>Telefon:</strong> {selectedContact.phone}</p>
                        <p><strong>Açıklama:</strong> {selectedContact.description}</p>
                        <p><strong>Tarih:</strong> {selectedContact.created_at}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationList;
