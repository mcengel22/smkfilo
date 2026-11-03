import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {useFaqFront} from "@/ServerSide/Hooks/useFaqFront.jsx";
import SectionHeading from "@/Components/UI/Misc/SectionHeading.jsx";

const Faq = () => {
    const { t } = useTranslation();
    const { faqs, loading, error } = useFaqFront();
    const [openIndex, setOpenIndex] = useState(0);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!loading && !error && faqs.length === 0) return null;

    return (
        <section className="faq-modern">
            <div className="max-w-3xl mx-auto px-4">
                <SectionHeading
                    eyebrow={t("Merak edilenler")}
                    title={t("Sıkça Sorulan Sorular")}
                    description={t("Araç kiralama süreciyle ilgili en çok sorulan soruların cevapları.")}
                />

                {loading && (
                    <div className="text-center py-6 text-gray-500">{t("Yükleniyor...")}</div>
                )}

                {error && (
                    <div className="text-center py-6 text-red-500">{error}</div>
                )}

                <div className="faq-list">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.id} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                                <button
                                    type="button"
                                    className="faq-question"
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${faq.id}`}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faq-toggle" aria-hidden="true" />
                                </button>

                                <div id={`faq-answer-${faq.id}`} className="faq-answer" role="region">
                                    <div className="faq-answer-inner">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Faq;
