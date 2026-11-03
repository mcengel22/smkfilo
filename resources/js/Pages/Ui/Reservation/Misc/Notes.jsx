import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ImportantNote = ({ deposit, checkInTime, checkOutTime }) => {
    const { t } = useTranslation();
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (id) => {
        setOpenSection((prev) => (prev === id ? null : id));
    };

    return (
        <div className="important-notes card bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">
                {t("Bilinmesi Gerekenler")}
            </h3>
            <div className="space-y-4">
                {/* Hasar Depozito */}
                <div className="note-item bg-gray-50 rounded-lg overflow-hidden">
                    <div
                        className="note-header flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection("deposit")}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
                                <img
                                    src="/svg/house-heart.svg"
                                    alt="Depozito"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Hasar Depozito
                                </h4>
                                <span className="text-sm text-gray-600">
                                    {deposit} TL
                                </span>
                            </div>
                        </div>
                        <div
                            className={`transform transition-transform ${openSection === "deposit" ? "rotate-180" : ""}`}
                        >
                            <img
                                src="/svg/chevron-up.svg"
                                alt="Aç/Kapat"
                                width={16}
                                height={16}
                            />
                        </div>
                    </div>
                    {openSection === "deposit" && (
                        <div className="note-content p-4 bg-white border-t">
                            <p className="text-gray-600">
                                Hasar depozitosu araç tesliminde ekstra olarak
                                alınır ve araç teslim edilirken bir hasar
                                olmaması durumunda geri iade edilir.
                            </p>
                        </div>
                    )}
                </div>

                {/* Fiyata Dahil Olanlar */}
                {/* <div className="note-item bg-gray-50 rounded-lg overflow-hidden">
                    <div
                        className="note-header flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection("included")}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <img src="/svg/all.svg" alt="Dahil Olanlar" width={20} height={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Fiyata Dahil Olanlar</h4>
                            </div>
                        </div>
                        <div className={`transform transition-transform ${openSection === "included" ? "rotate-180" : ""}`}>
                            <img src="/svg/chevron-up.svg" alt="Aç/Kapat" width={16} height={16} />
                        </div>
                    </div>
                    {openSection === "included" && (
                        <div className="note-content p-4 bg-white border-t">
                            <p className="text-gray-600">
                                Elektrik Kullanımı, Su Kullanımı, İnternet, Havuz ve Bahçe Bakımı, Tüpgaz
                            </p>
                        </div>
                    )}
                </div> */}

                {/* Giriş ve Çıkış Saatleri */}
                {/* <div className="note-item bg-gray-50 rounded-lg overflow-hidden">
                    <div
                        className="note-header flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection("times")}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <img src="/svg/cikis.svg" alt="Giriş Çıkış" width={20} height={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Giriş ve Çıkış Saatleri</h4>
                            </div>
                        </div>
                        <div className={`transform transition-transform ${openSection === "times" ? "rotate-180" : ""}`}>
                            <img src="/svg/chevron-up.svg" alt="Aç/Kapat" width={16} height={16} />
                        </div>
                    </div>
                    {openSection === "times" && (
                        <div className="note-content p-4 bg-white border-t">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-sm text-gray-600">Giriş Saati</span>
                                    <span className="font-medium text-gray-900">16.00</span>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <span className="block text-sm text-gray-600">Çıkış Saati</span>
                                    <span className="font-medium text-gray-900">10.00</span>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600 font-bold text-sm">
                                Belirtilen saatlere uyulması önemle rica olunur.
                            </p>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ImportantNote;
