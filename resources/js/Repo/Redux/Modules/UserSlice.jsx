import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    user: [],
    loading: false,
    error: null

};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.user = action.payload;
        },
        setRequest: (state, action) => {
            state.user = action.payload;
        },
        getUser: (state, action) => {
            state.user = action.payload;
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
    setUsers,
    setRequest,
    getUser,
    setError,
    setLoading } = userSlice.actions;
export default userSlice.reducer;
