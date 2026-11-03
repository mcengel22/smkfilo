import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    kmPackages: [],
    pagination: null,
    loading: false,
    error: null,
};

const kmPaketleriSlice = createSlice({
    name: 'kmPaketleri',
    initialState,
    reducers: {
        setKmPackages: (state, action) => {
            state.kmPackages = action.payload;
        },
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addKmPackage: (state, action) => {
            state.kmPackages.unshift(action.payload);
        },
        updateKmPackage: (state, action) => {
            const index = state.kmPackages.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.kmPackages[index] = action.payload;
            }
        },
        removeKmPackage: (state, action) => {
            state.kmPackages = state.kmPackages.filter(item => item.id !== action.payload);
        },
    },
});

export const {
    setKmPackages,
    setPagination,
    setLoading,
    setError,
    addKmPackage,
    updateKmPackage,
    removeKmPackage,
} = kmPaketleriSlice.actions;

export default kmPaketleriSlice.reducer;
