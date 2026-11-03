import { useSelector,useDispatch } from "react-redux";
import {
    makeReservation,
    reservationSuccess,
    reservationFailed,
    setLoading
} from "../../Repo/Redux/Modules/ReservationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../EndPoints";
import axios from "axios";
import { normalizeReservationData } from "../../../js/Components/UI/Utils/normalizeReservation";
import {setError} from "../../Repo/Redux/Modules/PostSlice.jsx";
import {apiService} from "../../ServerSide/Load";
import {t} from "i18next";
import { ROUTES } from "../../Libs/Routes/config";
import {setPaymentInfo} from "../../Repo/Redux/Modules/PaymentSlice";

export const useReservation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth?.token); // ya da localStorage'dan
    const reservations = useSelector(state => state.reservation);
    const postDetail = useSelector(state => state.post.detail);

    const createReservation = async (reservationState) => {
        try {
            dispatch(makeReservation());

            const reservationData = normalizeReservationData(reservationState);

            // ✅ ISO 8601 → MySQL uyumlu formata dönüştür
            const formatDateForMysql = (date) => {
                if (!date) return null;
                const d = new Date(date);
                return d.toISOString().slice(0, 19).replace('T', ' ');
            };

            reservationData.start_date = formatDateForMysql(reservationData.start_date || reservationData.startDate);
            reservationData.end_date   = formatDateForMysql(reservationData.end_date || reservationData.endDate);

            const response = await axios.post(
                `${API_CONFIG.ENDPOINTS.RESERVATION.RESERVATION}`,
                reservationData,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            if (response.data.success) {
                dispatch(reservationSuccess());

                dispatch(setPaymentInfo({
                    reservationId: response.data.data.reservation.code,
                    title: postDetail?.title,
                    paymentMethod: reservations?.paymentInfo?.paymentMethod,
                    paymentOption: reservations?.paymentInfo?.paymentOption,
                    amount: reservations?.paymentInfo?.amount,
                    selectedDates: {
                        start: reservations?.selectedDates?.start,
                        end: reservations?.selectedDates?.end
                    }
                }));

                // if (reservations?.paymentInfo?.paymentMethod === 'credit_card') {
                //     navigate(ROUTES.UI.PAYMENT);
                // } else if (reservations?.paymentInfo?.paymentMethod === 'bank_transfer') {
                //     navigate(ROUTES.UI.TRANSFER);
                // }

                return response.data;
            } else {
                dispatch(reservationFailed());
                toast.error(response?.data.errors?.error || response.data.message);
                return null;
            }
        } catch (error) {
            dispatch(reservationFailed());
            toast.error(error.response?.data?.errors?.error || error.message);
            throw error;
        }
    };


    const setReservationByFilter = async (filter) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION.FILTER, filter,
                { Authorization: `Bearer ${token}` });
            return response.data?.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getReservationsByPost = async (post_slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION.FILTER, post_slug,
                { Authorization: `Bearer ${token}` });
            return response.data?.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const getReservationsByPostRoot = async (post_slug) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION.ROOTFILTER, post_slug,
                { Authorization: `Bearer ${token}` });
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const setMusteriReservationByFilter = async (filter) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(API_CONFIG.ENDPOINTS.RESERVATION.USER_FILTER, filter,
                { Authorization: `Bearer ${token}` });
            return response.data?.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Yüklenemedi...'))
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const confirmReservation = async (id) => {
        try {
            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.RESERVATION.CONFIRMED}/${id}`,
                { Authorization: `Bearer ${token}` });
            toast.success(t('Rezervasyon onaylandı.'));
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Onaylama sırasında hata.'));
            throw error;
        }
    };

    const cancelReservation = async (id) => {
        try {
            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.RESERVATION.CANCELED}/${id}`,
                { Authorization: `Bearer ${token}` });
            toast.success(t('Rezervasyon reddedildi.'));
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Reddetme sırasında hata.'));
            throw error;
        }
    };

    const searchReservation = async (data) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.RESERVATION.SEARCH,
                data,
                {
                    Authorization: `Bearer ${token}`
                }
            );

            return response.data?.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(
                error.response?.data?.message || "Rezervasyon bulunamadı 😓"
            );
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createManualReservation = async (manualData) => {
        try {
            dispatch(makeReservation());

            const response = await apiService.post(
                `${API_CONFIG.ENDPOINTS.RESERVATION.MANUEL}`, // 👈 Manuel endpoint
                manualData,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            if (response.data.success) {
                dispatch(reservationSuccess());
                toast.success("Manuel rezervasyon oluşturuldu 🎉");
                return response.data;
            } else {
                dispatch(reservationFailed());
                toast.error("Manuel rezervasyon oluşturulamadı: " + response.data.message);
                return null;
            }
        } catch (error) {
            dispatch(reservationFailed());
            toast.error("Manuel rezervasyon hatası: " + (error.response?.data?.message || error.message));
            throw error;
        }
    };

    const createExternalReservation = async (externalData) => {
        try {
            dispatch(makeReservation());

            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.RESERVATION.EXTERNAL, // 👈 Harici endpoint
                externalData,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            if (response.data.success) {
                dispatch(reservationSuccess());
                toast.success("Harici rezervasyon oluşturuldu ✅");
                return response.data;
            } else {
                dispatch(reservationFailed());
                toast.error("Harici rezervasyon hatası: " + response.data.message);
                return null;
            }
        } catch (error) {
            dispatch(reservationFailed());
            toast.error("Harici rezervasyon sırasında hata: " + (error.response?.data?.message || error.message));
            throw error;
        }
    };
    const updateReservation = async (id, updatedData) => {
        try {
            dispatch(setLoading(true));

            const formatDateForMysql = (date) => {
                if (!date) return null;
                const d = new Date(date);
                return d.toISOString().slice(0, 19).replace('T', ' ');
            };

            // 🔧 Tarihleri düzgün formatla
            updatedData.start_date = formatDateForMysql(updatedData.start_date || updatedData.startDate);
            updatedData.end_date = formatDateForMysql(updatedData.end_date || updatedData.endDate);

            // 🔥 PUT isteği — rota yapına birebir uygun
            const response = await axios.put(
                `${API_CONFIG.ENDPOINTS.RESERVATION.UPDATE}/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success(t('Rezervasyon başarıyla güncellendi ✅'));
                return response.data;
            } else {
                toast.error(response.data.message || t('Güncelleme başarısız ❌'));
                return null;
            }
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('Güncelleme sırasında hata oluştu ⚠️'));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };
    const deleteReservation = async (id) => {
        try {
            dispatch(setLoading(true));

            const response = await apiService.delete(
                `${API_CONFIG.ENDPOINTS.RESERVATION.DELETE}/${id}`,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            toast.success(t("Rezervasyon kalıcı olarak silindi 🗑️"));
            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t("Silme sırasında hata oluştu ❌"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };


    return {
        createReservation,
        createManualReservation,
        createExternalReservation, // 👈 Bunu ekle
        getReservationsByPost: getReservationsByPost,
        getReservationsByPostRoot: getReservationsByPostRoot,
        useReservationByFilter: setReservationByFilter,
        useMusteriReservationByFilter: setMusteriReservationByFilter,
        confirmReservation,
        cancelReservation,
        searchReservation, // ✅ BU OLACAK
        updateReservation, // ✅ Eklendi
        deleteReservation, // 🔥 BUNU EKLEMELİSİN
    };
};
