import React, { useState } from "react";
import {useFaqFront} from "@/ServerSide/Hooks/useFaqFront.jsx";

const Faq = () => {
    const { faqs, loading, error } = useFaqFront();
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq py-10">
            <div className="max-w-6xl mx-auto px-3">

                <h2 className="text-3xl font-bold text-center mb-8">
                    Sıkça Sorulan Sorular
                </h2>

                {loading && (
                    <div className="text-center py-6 text-gray-500">Yükleniyor...</div>
                )}

                {error && (
                    <div className="text-center py-6 text-red-500">{error}</div>
                )}

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={faq.id} className="border rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className={`w-full text-left px-4 py-3 font-semibold transition-all ${
                                    openIndex === index
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-900"
                                }`}
                            >
                                {faq.question}
                            </button>

                            {openIndex === index && (
                                <div className="px-4 py-3 bg-white text-gray-700 border-t">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
