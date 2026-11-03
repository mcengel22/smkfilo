import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    policies: [],
    loading: false,
    error: null,
};

const policiesSlice = createSlice({
    name: "policies",
    initialState,
    reducers: {
        setPolicies: (state, action) => {
            state.policies = action.payload;
        },
        addPolicy: (state, action) => {
            state.policies.push(action.payload);
        },
        updatePolicy: (state, action) => {
            const index = state.policies.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.policies[index] = action.payload;
        },
        deletePolicy: (state, action) => {
            state.policies = state.policies.filter(p => p.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setPolicies,
    addPolicy,
    updatePolicy,
    deletePolicy,
    setLoading,
    setError,
} = policiesSlice.actions;

export default policiesSlice.reducer;
