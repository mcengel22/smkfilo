import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    selectedDates: {
        start: null,
        end: null
    },
    personCount: {
        adult: 2,
        child: 0,
        baby: 0
    },
    paymentInfo: {
        paymentMethod: 'credit_card',
        paymentOption: 'prepayment',
        amount: null,
    },
    couponCode: null,
    appliedCoupon: null,
    discountAmount: 0,
    guest: {},
    specialNotes: null,
    postSlug: null,
    totalPrice: 0,
    nightPrices: [],
    totalNights: 0,
    cleaningFee: 0,
    cleaningDays: 0,
    deposit: 0,
    prePaymentRate: 1.0,
    isSubmitting: false,
    sessionToken: null,
    optionExpiryTime: null,
    isOptionActive: false,
    loading: false,
    selectedPackage: null,
    selectedExtraKm: null,
};

export const ReservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setSelectedDates: (state, action) => {
            const { start, end } = action.payload;
            state.selectedDates = {
                start,
                end
            };
        },
        setPersonCount: (state, action) => {
            state.personCount = action.payload;
        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        setNightPrices: (state, action) => {
            state.nightPrices = action.payload;
        },
        setTotalNights: (state, action) => {
            state.totalNights = action.payload;
        },
        setCleaningFee: (state, action) => {
            state.cleaningFee = action.payload;
        },
        setCleaningDays: (state, action) => {
            state.cleaningDays = action.payload;
        },
        setPrePaymentRate: (state, action) => {
            state.prePaymentRate = action.payload;
        },
        setIsSubmitting: (state, action) => {
            state.isSubmitting = action.payload;
        },
        setPaymentInfo: (state, action) => {
            state.paymentInfo = action.payload;
        },
        makeReservation: (state) => {
            state.isSubmitting = true;
        },
        reservationSuccess: (state) => {
            state.isSubmitting = false;
        },
        reservationFailed: (state) => {
            state.isSubmitting = false;
        },
        clearReservation: () => {
            return initialState;
        },
        initializeSession: (state) => {
            state.sessionToken = uuidv4();
            state.optionExpiryTime = Date.now() + (5 * 60 * 1000); // 5 dakika
            state.isOptionActive = true;
        },
        extendOption: (state) => {
            state.optionExpiryTime = Date.now() + (3 * 60 * 1000); // 3 dakika ek süre
        },
        checkOptionStatus: (state) => {
            if (state.optionExpiryTime && state.optionExpiryTime < Date.now()) {
                state.isOptionActive = false;
            }
        },
        clearSession: (state) => {
            state.sessionToken = null;
            state.optionExpiryTime = null;
            state.isOptionActive = false;
        },
        setReservationData: (state, action) => {
            const allowedKeys = Object.keys(initialState); // sadece geçerli anahtarları güncelle
            Object.entries(action.payload).forEach(([key, value]) => {
                if (allowedKeys.includes(key)) {
                    state[key] = value;
                }
            });
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAppliedCoupon: (state, action) => {
            state.appliedCoupon = action.payload?.coupon || null;
            state.discountAmount = action.payload?.discountAmount || 0;
        },
        clearAppliedCoupon: (state) => {
            state.appliedCoupon = null;
            state.discountAmount = 0;
        },
        setSelectedPackage: (state, action) => {
            state.selectedPackage = action.payload;
            // Fiyatı otomatik güncelle
            const basePrice = action.payload ? Number(action.payload.price) : 0;
            const extraPrice = state.selectedExtraKm ? Number(state.selectedExtraKm.price) : 0;
            state.totalPrice = basePrice + extraPrice;
        },
        setSelectedExtraKm: (state, action) => {
            state.selectedExtraKm = action.payload;
            // Fiyatı otomatik güncelle
            const basePrice = state.selectedPackage ? Number(state.selectedPackage.price) : 0;
            const extraPrice = action.payload ? Number(action.payload.price) : 0;
            state.totalPrice = basePrice + extraPrice;
        },
    }
});

export const {
    setReservationData,
    setSelectedDates,
    setPersonCount,
    setTotalPrice,
    setNightPrices,
    setTotalNights,
    setCleaningFee,
    setCleaningDays,
    setPaymentInfo,
    setPrePaymentRate,
    setIsSubmitting,
    makeReservation,
    reservationSuccess,
    reservationFailed,
    clearReservation,
    initializeSession,
    extendOption,
    checkOptionStatus,
    clearSession,
    setLoading,
    setAppliedCoupon,
    clearAppliedCoupon,
    setSelectedPackage,
    setSelectedExtraKm
} = ReservationSlice.actions;

export default ReservationSlice.reducer;
