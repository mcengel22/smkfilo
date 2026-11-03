import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    blogs: [],
    blog: null,
    pagination: null,
    loading: false,
    error: null,
};

export const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        // ✅ Yüklenme durumu
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // ✅ Hata yakalama
        setError: (state, action) => {
            state.error = action.payload;
        },

        // ✅ Blog listesi + pagination
        setBlogs: (state, action) => {
            state.blogs = action.payload.blogs || [];
            state.pagination = action.payload.pagination || null;
        },

        // ✅ Tekil blog
        getBlog: (state, action) => {
            state.blog = action.payload;
        },
    },
});

export const { setLoading, setError, setBlogs, getBlog } = blogSlice.actions;
export default blogSlice.reducer;
