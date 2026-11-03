export const normalizePaymentData = (payment) => {
    const formattedCardNumber = payment.cardNumber.replace(/\s/g, "");

    // Expiry değerini ay ve yıl olarak ayır
    const [expireMonth, expireYear] = payment.expiry.split("/");

    return {
        pan: formattedCardNumber,
        Ecom_Payment_Card_ExpDate_Month: expireMonth,
        Ecom_Payment_Card_ExpDate_Year: "20" + expireYear,
        cv2: payment.cvc,
        cardType: '',
        clientid: 700684815277,
        amount: parseFloat(payment.amount).toFixed(),
        okurl: "https://tatilmerasi.com/api/v1/payten/success",
        failUrl: "https://tatilmerasi.com/api/v1/payten/fail",
        TranType: 'Auth',
        Instalment: '',
        rnd: Math.random(),
        callbackUrl: "https://tatilmerasi.com/api/v1/payten/callback",
        currency: 949,
        storetype: '3d',
        hashAlgorithm: 'ver3',
        lang: 'tr',
        BillToName: payment.cardHolderName,
        BillToCompany: 'BillToCompany',
        oid: payment.reservationId || '',
    };
};
