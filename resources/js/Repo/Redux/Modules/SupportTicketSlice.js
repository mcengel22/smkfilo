import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tickets: [],
};

const supportTicketSlice = createSlice({
    name: "supportTicket",
    initialState,
    reducers: {
        setSupportTickets: (state, action) => {
            state.tickets = action.payload;
        },
    },
});

export const { setSupportTickets } = supportTicketSlice.actions;
export default supportTicketSlice.reducer;
