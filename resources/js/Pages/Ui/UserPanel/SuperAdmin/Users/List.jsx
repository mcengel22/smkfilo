import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../../Libs/Routes/config";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../../../ServerSide/Hooks/useUser";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserList = () => {
    const { setUsers, deleteUsers } = useUser();
    const users = useSelector(state => state.user.user);
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    /* ================= FETCH ================= */
    useEffect(() => {
        setUsers(page);
    }, [page]);

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            await deleteUsers(id);
            toast.success('Başarıyla silindi');
            setUsers(page);
        }
    };

    /* ================= PAGINATION ================= */
    const meta = users?.meta;
    console.log("USERS STATE:", users);
    const renderPagination = () => {
        if (!meta || meta.last_page <= 1) return null;

        return (
            <div className="pagination">
                <button
                    disabled={meta.current_page === 1}
                    onClick={() => setPage(meta.current_page - 1)}
                >
                    ‹
                </button>

                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        className={p === meta.current_page ? "active" : ""}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => setPage(meta.current_page + 1)}
                >
                    ›
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className="title">
                <h1>{t('Kullanıcı Yönetimi')}</h1>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box">
                        <input placeholder="Ad, e-posta veya telefon ile ara..." />
                    </div>

                    <Link to={ROUTES.UI.CUSTOMERADD} className="btn btn-primary">
                        {t('Yeni Kullanıcı')}
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive table-area">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Kullanıcı Tipi</th>
                                <th>Ad Soyad</th>
                                <th>E-posta</th>
                                <th>Telefon</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users?.data?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.type}</td>
                                    <td>{user.name} {user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.status}</td>
                                    <td className="actions">
                                        <Link to={`${ROUTES.UI.CUSTOMEREDIT}/${user.id}`}>
                                            ✏️
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)}>
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {renderPagination()}
                </div>
            </div>

            {/* === MINIMAL STYLE (tasarım bozmaz) === */}
            <style jsx>{`
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    margin-top: 16px;
                }
                .pagination button {
                    min-width: 32px;
                    height: 32px;
                    border: 1px solid #ddd;
                    background: #fff;
                    border-radius: 6px;
                }
                .pagination button.active {
                    background: #0d6efd;
                    color: #fff;
                    border-color: #0d6efd;
                }
                .pagination button:disabled {
                    opacity: 0.4;
                }
            `}</style>
        </div>
    );
};

export default UserList;
