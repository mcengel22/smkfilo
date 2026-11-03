import React from "react";

// Ana sayfa bölümleri için ortak başlık: küçük üst etiket + başlık + açıklama
const SectionHeading = ({ eyebrow, title, description, align = "center" }) => (
    <div className={`section-heading section-heading--${align}`}>
        {eyebrow && <span className="section-heading-eyebrow">{eyebrow}</span>}
        <h2 className="section-heading-title">{title}</h2>
        {description && <p className="section-heading-desc">{description}</p>}
    </div>
);

export default SectionHeading;
