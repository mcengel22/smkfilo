import { createSlice } from '@reduxjs/toolkit';

/* ---------------------------------------------------
 🧩 INITIAL STATE
--------------------------------------------------- */
const initialState = {
    faqs: [],          // 🔹 Liste verileri
    faq: null,         // 🔹 Tekil SSS kaydı
    pagination: null,  // 🔹 Sayfalama
    loading: false,
    error: null,
};

/* ---------------------------------------------------
 🧩 SLICE TANIMI
--------------------------------------------------- */
const faqSlice = createSlice({
    name: 'faq',
    initialState,
    reducers: {
        // ✅ Liste verisi + pagination
        setFaqs: (state, action) => {
            state.faqs = action.payload?.faqs || [];
            state.pagination = action.payload?.pagination || null;
            state.loading = false;
        },

        // ✅ Tekil kayıt (getFaq)
        getFaq: (state, action) => {
            state.faq = action.payload || null;
            state.loading = false;
        },

        // ✅ Hata yönetimi
        setError: (state, action) => {
            state.error = action.payload || "Bilinmeyen hata";
            state.loading = false;
        },

        // ✅ Yüklenme durumu
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

/* ---------------------------------------------------
 🧩 ACTION EXPORT
--------------------------------------------------- */
export const {
    setFaqs,
    getFaq,
    setError,
    setLoading,
} = faqSlice.actions;

/* ---------------------------------------------------
 🧩 REDUCER EXPORT
--------------------------------------------------- */
export default faqSlice.reducer;

/* ---------------------------------------------------
 🧩 SELECTORLAR (state.home.faq altında!)
--------------------------------------------------- */

// 🔹 Tüm listeyi döndürür
export const selectFaqs = (state) => state.home?.faq?.faqs || [];

// 🔹 Tekil kaydı döndürür
export const selectFaq = (state) => state.home?.faq?.faq || null;

// 🔹 Pagination bilgisi
export const selectFaqPagination = (state) => state.home?.faq?.pagination || null;

// 🔹 Yüklenme durumu
export const selectFaqLoading = (state) => state.home?.faq?.loading || false;

// 🔹 Hata durumu
export const selectFaqError = (state) => state.home?.faq?.error || null;
