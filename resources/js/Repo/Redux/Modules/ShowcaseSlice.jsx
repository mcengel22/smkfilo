import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showcases: [],
    loading: false,
    error: null

};


const showcaseSlice = createSlice({
    name: 'showcase',
    initialState,
    reducers: {
        setShowcases: (state, action) => {
            state.showcases = action.payload.data;
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
    setShowcases,
    setError,
    setLoading } = showcaseSlice.actions;
export default showcaseSlice.reducer;
