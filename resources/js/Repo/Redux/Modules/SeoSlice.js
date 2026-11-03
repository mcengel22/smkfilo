import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    seos: [],
    seo: null,
    pagination: null,
    loading: false,
    error: null
};

export const seoSlice = createSlice({
    name: 'seo',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSeos: (state, action) => {
            // ✅ Doğru payload key'leri
            state.seos = action.payload.seos || [];
            state.pagination = action.payload.pagination || null;
        },
        getSeo: (state, action) => {
            state.seo = action.payload;
        }
    }
});

export const { setLoading, setError, setSeos, getSeo } = seoSlice.actions;
export default seoSlice.reducer;
