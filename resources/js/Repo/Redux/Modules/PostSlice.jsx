import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    detail : [],
    seo : [],
    pagination : [],
    loading: false,
    error: null

};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        getPosts: (state, action) => {
            state.posts = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setDetails: (state, action) => {
            state.detail = action.payload.data;
        },
        setPostSeo: (state, action) => {
            state.seo = action.payload.data;
        }

    }

});

export const {
    setPosts,
    getPosts,
    setError,
    setLoading,
    setDetails,
    setPostSeo,
} = postSlice.actions;
export default postSlice.reducer;
