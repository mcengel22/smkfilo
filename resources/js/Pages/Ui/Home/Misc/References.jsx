import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useReference } from "@/ServerSide/Hooks/useReference.jsx";
import SectionHeading from "@/Components/UI/Misc/SectionHeading.jsx";

// Az logo olsa da şerit ekranı boşluksuz doldursun diye liste en az bu kadar öğeye tamamlanır
const MIN_ITEMS = 10;

const References = () => {
    const { t } = useTranslation();
    const { references, fetchReferences } = useReference();

    useEffect(() => {
        fetchReferences();
    }, [fetchReferences]);

    const items = references.filter((item) => item.logo);
    if (items.length === 0) return null;

    const base = [];
    while (base.length < MIN_ITEMS) base.push(...items);

    // Kesintisiz döngü için liste iki kez basılıyor; hız öğe sayısıyla orantılı
    const loop = [...base, ...base];
    const duration = `${base.length * 3}s`;

    return (
        <section className="references">
            <div className="max-w-6xl mx-auto px-4">
                <SectionHeading
                    eyebrow={t("Bize güvenenler")}
                    title={t("Referanslarımız")}
                />
            </div>

            <div className="references-marquee">
                <div className="references-track" style={{ animationDuration: duration }}>
                    {loop.map((item, index) => {
                        const logo = <img src={item.logo} alt={item.name} loading="lazy" />;

                        return (
                            <div
                                key={index}
                                className="references-item"
                                aria-hidden={index >= items.length}
                                title={item.name}
                            >
                                {item.link ? (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" tabIndex={index >= items.length ? -1 : 0}>
                                        {logo}
                                    </a>
                                ) : (
                                    logo
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default References;
