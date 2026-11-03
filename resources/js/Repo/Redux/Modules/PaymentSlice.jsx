import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    title: null,
    reservationId: null,
    paymentMethod: 'credit_card',
    paymentOption: 'prepayment',
    amount: null,
    cardHolderName: null,
    cardNumber: null,
    expiry: null,
    cvc: null,
    selectedDates: {
        start: null,
        end: null
    },
    loading: false,
    error: null,
    success: false,
};

export const PaymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setPaymentInfo: (state, action) => {
            state.reservationId = action.payload.reservationId;
            state.title = action.payload.title;
            state.paymentMethod = action.payload.paymentMethod;
            state.paymentOption = action.payload.paymentOption;
            state.amount = action.payload.amount;
            state.selectedDates = {
                start: action.payload.selectedDates?.start,
                end: action.payload.selectedDates?.end
            };
        },
        setCardInfo: (state, action) => {
            state.cardHolderName = action.payload.cardHolderName;
            state.cardNumber = action.payload.cardNumber;
            state.expiry = action.payload.expiry;
            state.cvc = action.payload.cvc;
        },
        makePayment: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        paymentSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        paymentFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Payment failed';
            state.success = false;
        },
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            // Clear sensitive card information
            state.cardHolderName = null;
            state.cardNumber = null;
            state.expiry = null;
            state.cvc = null;
        },
        resetAllPaymentState: () => {
            return initialState;
        },
    }
});

export const {
    setPaymentInfo,
    setCardInfo,
    makePayment,
    paymentSuccess,
    resetAllPaymentState,
    paymentFailed,
    resetPaymentState
} = PaymentSlice.actions;

export default PaymentSlice.reducer;
