import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const CampaignModal = ({ isOpen, closeModal, content }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState("");
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);

    const copyToClipboard = () => {
        if (inputRef.current) {
            inputRef.current.select();
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2 saniye sonra geri al
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 campaign-modal">
            <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 mx-3 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-0">{ content.title }</h2>
                    <button onClick={closeModal} className="close-btn">
                        <i className="icon xmark"></i>
                    </button>
                </div>
                <h6 className="fw-bold">{content.content}
                </h6>
                <p>
                    {content.long_content}
                </p>

                <div className="copy-text">
                    <label className="text-sm font-bold">{t('Kampanya Kodu')}</label>
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-control"
                            value={content.coupon.code}
                            readOnly
                        />
                        <button
                            onClick={copyToClipboard}
                        >
                            {copied ? t("Kopyalandı!") : t("Kopyala")}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default CampaignModal;
