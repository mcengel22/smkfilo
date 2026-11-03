import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filters: JSON.parse(localStorage.getItem('filters')) || {},
    loading: false,
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            // Tüm filtreleri güncelle
            state.filters = action.payload;
            // LocalStorage'e kaydet
            localStorage.setItem('filters', JSON.stringify(action.payload));
        },
        updateFilters: (state, action) => {
            // Spesifik alanları güncelle (ör. "region", "start_date", "end_date")
            state.filters = {
                ...state.filters, // Mevcut filtreleri koru
                ...action.payload, // Yeni filtreleri ekle veya değiştir
            };
            // Güncellenen filtreleri LocalStorage'a kaydet
            localStorage.setItem('filters', JSON.stringify(state.filters));
        },
        setLoading: (state, action) => {
            // Yüklenme durumu güncellemesi
            state.loading = action.payload;
        },
        resetFilters: (state) => {
            // Filtreleri sıfırla
            state.filters = {};
            // LocalStorage'den filtreleri kaldır
            localStorage.removeItem('filters');
        },
    },
});

export const { setFilters, updateFilters, setLoading, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;

export const changePage = (page) => (dispatch, getState) => {
    const { filter } = getState();
    const updatedFilters = {
        ...filter.filters,
        pagination : {
            pageNumber : page,
        }
    };

    dispatch(setFilters(updatedFilters));
};
