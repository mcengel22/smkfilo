import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comments: [],
    loading: false,
    error: null

};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload.data;
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
    setComments,
    setError,
    setLoading } = commentSlice.actions;
export default commentSlice.reducer;
