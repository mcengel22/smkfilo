import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coupons: [],  // Kuponları saklayacak alan
    loading: false,  // Yükleme durumu
    error: null,  // Hata mesajı
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        setCoupons: (state, action) => {
            state.coupons = action.payload.data;  // Kuponları state'e kaydediyoruz
        },
        setLoading: (state, action) => {
            state.loading = action.payload;  // Yükleme durumunu güncelliyoruz
        },
        setError: (state, action) => {
            state.error = action.payload;  // Hata mesajını güncelliyoruz
        },
    },
});

export const { setCoupons, setLoading, setError } = couponSlice.actions;

export default couponSlice.reducer;
