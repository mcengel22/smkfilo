import React from "react";
import { IMaskInput } from "react-imask";
import { useField, useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setReservationData } from "../../../Repo/Redux/Modules/ReservationSlice";

const MaskedPhoneInput = ({ ...props }) => {
    const [field, meta, helpers] = useField(props);
    const { setValue } = helpers;
    const dispatch = useDispatch();
    const reservation = useSelector((state) => state.reservation);

    const handleAccept = (value, mask) => {
        const raw = value.replace(/\D/g, "");
        setValue(value); // Formik input değeri
        dispatch(
            setReservationData({
                guest: {
                    ...reservation.guest,
                    phone: raw,
                },
            })
        );
    };

    return (
        <div>
            <IMaskInput
                {...field}
                {...props}
                mask="0000 000 00 00"
                radix="."
                lazy={false}
                unmask={false}
                placeholder="0506 123 45 67"
                onAccept={handleAccept}
                className="form-input pl-10 w-full h-11 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            {meta.touched && meta.error && (
                <div className="error-input">{meta.error}</div>
            )}
        </div>
    );
};

export default MaskedPhoneInput;
