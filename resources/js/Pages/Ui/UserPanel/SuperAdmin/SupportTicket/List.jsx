import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSupportTicket } from "../../../../../ServerSide/Hooks/useSupportTicket";

const SupportTicketList = () => {
    const { t } = useTranslation();
    const { getSupportTickets } = useSupportTicket();
    const tickets = useSelector((state) => state.supportTicket.tickets);

    useEffect(() => {
        getSupportTickets();
    }, []);

    return (
        <div>
            <div className="title">
                <h1>{t("Destek Talepleri")}</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive table-area">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t("ID")}</th>
                                    <th>{t("Kullanıcı")}</th>
                                    <th>{t("Telefon")}</th>
                                    <th>{t("Eposta")}</th>
                                    <th>{t("Mesaj")}</th>

                                    <th>{t("Tarih")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>{ticket.id}</td>
                                            <td>{ticket.full_name ? ticket.full_name : '-'}</td>
                                            <td>{ticket.phone ? ticket.phone : '-'}</td>
                                            <td>{ticket.email ? ticket.email : '-'}</td>
                                            <td>{ticket.message ? ticket.message : '-'}</td>

                                            <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">{t("Hiç destek talebi bulunamadı.")}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketList;
