import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    features: [],
    rules: [],
    operations:[],
    nears: [],
    attr:[],
    loading: false,
    error: null

};

const attrSlice = createSlice({
    name: 'attr',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload.data;
        },
        setAttrs: (state, action) => {
            state.attr = action.payload.data;
        },
        setFeatures: (state, action) => {
            state.features = action.payload.data;
        },
        setRules: (state, action) => {
            state.rules = action.payload.data;
        },
        setOperations: (state, action) => {
            state.operations = action.payload.data;
        },
        setNears: (state, action) => {
            state.nears = action.payload.data;
        },
        getAttr: (state, action) => {
            state.attr = action.payload.data;
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
    setCategories,
    setAttrs,
    setFeatures,
    setRules,
    setOperations,
    setNears,
    getAttr,
    setError,
    setLoading } = attrSlice.actions;
export default attrSlice.reducer;
