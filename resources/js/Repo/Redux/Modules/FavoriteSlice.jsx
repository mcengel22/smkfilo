import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    favorites: [],
    loading: false,
    error: null

};

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        setFavorites: (state, action) => {
            state.favorite = action.payload.data;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }

    }

});


export const {
    setFavorites,
    setError,
    setLoading } = favoriteSlice.actions;
export default favoriteSlice.reducer;
