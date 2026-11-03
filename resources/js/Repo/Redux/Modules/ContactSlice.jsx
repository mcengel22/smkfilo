import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contacts: [],
    loading: false,
    error: null

};

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        setContacts: (state, action) => {
            state.contacts = action.payload.data;
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
    setContacts,
    setError,
    setLoading } = contactSlice.actions;
export default contactSlice.reducer;
