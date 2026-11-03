export const normalizeReservationData = (reservation) => {
    const guest = reservation.guest || {};

    return {
        postSlug: reservation.postSlug, // Slug backend'de post_id'ye çevrilecek
        start_date: reservation.selectedDates?.start,
        end_date: reservation.selectedDates?.end,
        price: reservation.paymentInfo?.amount || reservation.totalPrice,
        coupon_code: reservation.appliedCoupon?.code || null,
        discount_amount: reservation.discountAmount || 0,
        reservation_details: {
            adults: reservation.personCount?.adult || 1,
            children: reservation.personCount?.child || 0,
            infants: reservation.personCount?.baby || 0,
            cleaning_fee: reservation.cleaningFee || 0,
            deposit: reservation.deposit || 0,
            note: reservation.specialNotes || null,
            post_price_id: reservation.selectedPackage?.id || null,
            km_package_id: reservation.selectedExtraKm?.id || null,
        },

        payment_method: reservation.paymentInfo?.paymentMethod || "credit_card",

        guest: {
            first_name: guest?.first_name || null,
            last_name: guest?.last_name || null,
            email: guest?.email || null,
            phone: guest?.phone || null
        }
    };
};
