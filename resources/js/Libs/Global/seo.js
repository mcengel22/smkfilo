export const SITE_NAME = "SMK Filo";

// Google'da marka aramasında çıkabilmek için her başlıkta "SMK Filo" geçsin
export const withBrand = (title) => {
    if (!title) return SITE_NAME;
    return title.toLowerCase().includes("smk filo") ? title : `${title} | ${SITE_NAME}`;
};
