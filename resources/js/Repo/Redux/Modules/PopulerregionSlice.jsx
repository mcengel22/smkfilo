import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    populerregions: [],
    loading: false,
    error: null,
};

const populerregionSlice = createSlice({
    name: "populerregion",
    initialState,
    reducers: {
        setPopulerregions: (state, action) => {
            state.populerregions = action.payload || [];
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setPopulerregions, setError, setLoading } =
    populerregionSlice.actions;
export default populerregionSlice.reducer;
