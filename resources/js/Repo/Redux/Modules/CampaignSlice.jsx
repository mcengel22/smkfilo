import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    campaigns: [],
    campaign: [],
    loading: false,
    error: null

};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        setCampaigns: (state, action) => {
            state.campaigns = action.payload.data;
        },
        getCampaign: (state, action) => {
            state.campaign = action.payload.data;
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
    setCampaigns,
    getCampaign,
    setError,
    setLoading } = campaignSlice.actions;
export default campaignSlice.reducer;
