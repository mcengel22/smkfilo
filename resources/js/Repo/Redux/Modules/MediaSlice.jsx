// src/store/modules/mediaSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    medias: [],
    loading: false,
    error: null,
};

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        setMedias(state, action) {
            state.medias = action.payload;    // payload: Media[]
            state.error = null;
            state.loading = false;
        },
        addMedias(state, action) {
            // payload: Media[]
            state.medias = [...state.medias, ...action.payload];
        },
        removeMedia(state, action) {
            // payload: mediaId
            state.medias = state.medias.filter(m => m.id !== action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;   // boolean
        },
        setError(state, action) {
            state.error = action.payload;     // error message
            state.loading = false;
        },
    },
});

export const {
    setMedias,
    addMedias,
    removeMedia,
    setLoading,
    setError,
} = mediaSlice.actions;

export default mediaSlice.reducer;
