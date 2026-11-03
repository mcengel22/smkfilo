import { useSelector,useDispatch } from "react-redux";
import {
    makePayment,
    paymentFailed,
} from "../../Repo/Redux/Modules/PaymentSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../EndPoints";
import axios from "axios";
import { normalizePaymentData } from "../../../js/Components/UI/Utils/normalizePayment.jsx";
import {apiService} from "@/ServerSide/Load.jsx";
import {t} from "i18next";
import {setError} from "@/Repo/Redux/Modules/PostSlice.jsx";

export const usePayment = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth?.token); // ya da localStorage'dan

    const createPayment = async (paymentState) => {
        try {
            dispatch(makePayment());

            const paymentData = normalizePaymentData(paymentState);

            // Create a form element
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = API_CONFIG.ENDPOINTS.PAYMENT.CREATE_PAYMENT;


                // Set up form to include the Authorization header
                form.setAttribute('data-token', token);

                // Add an onsubmit event to handle the token in header
                form.onsubmit = function(e) {
                    // This prevents the default form submission
                    e.preventDefault();

                    // Create a FormData object from the form
                    const formData = new FormData(form);

                    // Use fetch API to send the request with proper headers
                    fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    .then(response => {
                        if (response.redirected) {
                            window.location.href = response.url;
                        }
                    })
                    .catch(err => {
                        dispatch(paymentFailed(err.message));
                        toast.error("" + err.message);
                    });

                };

            // Add all payment data as hidden inputs
            Object.entries(paymentData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            // Add form to document body
            document.body.appendChild(form);

            // If token is available, the onsubmit handler will be used
            // Otherwise, submit the form normally
            form.submit();
            // Remove form from document body
            document.body.removeChild(form);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(paymentFailed(errorMessage));
            toast.error("" + errorMessage);
            throw error;
        }
    };

    const failPayment = async (code) => {
        try {
            const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.FAIL}`, code);

            return response.data;
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(t('İptal sırasında hata.'));
            throw error;
        }
    };

    return {
        createPayment,
        failPayment,
    };
};
