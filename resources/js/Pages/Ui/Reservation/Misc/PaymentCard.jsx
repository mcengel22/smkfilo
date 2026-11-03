import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
    setPaymentInfo,
    setAppliedCoupon,
    clearAppliedCoupon,
} from "../../../../Repo/Redux/Modules/ReservationSlice";
import { useCoupon } from "../../../../ServerSide/Hooks/useCoupon";

const PaymentCard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { validateCoupon } = useCoupon();
    const [couponError, setCouponError] = useState("");
    const {
        paymentInfo,
        totalPrice,
        prePaymentRate,
        discountAmount,
        appliedCoupon,
        postDetail,
        user,
    } = useSelector((state) => ({
        paymentInfo: state.reservation.paymentInfo,
        totalPrice: state.reservation.totalPrice,
        prePaymentRate: state.reservation.prePaymentRate,
        discountAmount: state.reservation.discountAmount || 0,
        appliedCoupon: state.reservation.appliedCoupon,
        postDetail: state.post.detail,
        user: state.auth?.user,
    }));

    const { paymentOption, paymentMethod } = paymentInfo;

    const discountedTotal = Math.max(
        0,
        Math.round(totalPrice - (discountAmount || 0)),
    );

    // Hesaplama fonksiyonu: indirim -> ön ödeme ya da tam -> kart farkı
    const computeAmount = (option, method) => {
        const base =
            option === "prepayment"
                ? Math.round(discountedTotal * prePaymentRate)
                : discountedTotal;
        return method === "credit_card" ? Math.round(base * 1.25) : base;
    };

    // Kupon UI state
    const [couponCode, setCouponCode] = useState("");
    const [applying, setApplying] = useState(false);

    // Mount olduğunda veya fiyat/oran/indirim değiştiğinde başlat
    useEffect(() => {
        const initialAmount = computeAmount(paymentOption, paymentMethod);
        dispatch(
            setPaymentInfo({
                paymentOption,
                paymentMethod,
                amount: initialAmount || 0,
            }),
        );
    }, [discountedTotal, prePaymentRate]);

    // Seçenek değiştiğinde
    const handleOptionChange = (option) => {
        const newAmount = computeAmount(option, paymentMethod);
        dispatch(
            setPaymentInfo({
                ...paymentInfo,
                paymentOption: option,
                amount: newAmount,
            }),
        );
    };

    // Yöntem değiştiğinde
    const handleMethodChange = (method) => {
        const newAmount = computeAmount(paymentOption, method);
        dispatch(
            setPaymentInfo({
                ...paymentInfo,
                paymentMethod: method,
                amount: newAmount,
            }),
        );
    };

    const onApplyCoupon = async () => {
        if (!couponCode) return;

        try {
            setApplying(true);
            setCouponError(""); // önce hata temizle

            const result = await validateCoupon({
                code: couponCode,
                postId: postDetail?.id,
                orderTotal: totalPrice,
                userId: user?.id,
            });

            if (result) {
                dispatch(setAppliedCoupon(result));
            } else {
                setCouponError(t("Kupon bulunamadı veya geçersiz."));
            }
        } catch (err) {
            setCouponError(t("Kupon bulunamadı veya geçersiz."));
        } finally {
            setApplying(false);
        }
    };

    const onRemoveCoupon = () => {
        dispatch(clearAppliedCoupon());
        setCouponCode("");
    };
    // Sayfa kapandığında kuponu sıfırla
    useEffect(() => {
        return () => {
            dispatch(clearAppliedCoupon());
        };
    }, []);

    const isLoggedIn = !!user; // Check if user is logged in

    return (
        <div className="card bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">
                {t("Ödeme Bilgileri")}
            </h3>

            {/* Kupon Alanı */}
            <div className="mb-6">
                {/* <label className="block text-sm text-gray-600 mb-2">{t('Kupon Kodu')}</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder={t('Kupon kodu giriniz')}
                        disabled={!isLoggedIn || !!appliedCoupon} // Disable if not logged in or coupon applied
                    />
                    {!appliedCoupon ? (
                        <button
                            onClick={onApplyCoupon}
                            disabled={!isLoggedIn || !couponCode || applying} // Disable if not logged in, no code, or applying
                            className={`px-4 py-2 rounded-lg text-white ${(!isLoggedIn || !couponCode || applying) ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                            {applying ? t('Uygulanıyor...') : t('Uygula')}
                        </button>
                    ) : (
                        <button
                            onClick={onRemoveCoupon}
                            className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                        >
                            {t('Kaldır')}
                        </button>
                    )}
                </div> */}
                {!isLoggedIn && (
                    <div className="mt-2 text-sm text-gray-700">
                        {t("Kupon kodu kullanmak için ")}
                        <a
                            href="https://smkfilo.com/Kullanici/Giris"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            {t("Giriş Yapın")}
                        </a>
                        .
                    </div>
                )}
                {appliedCoupon && (
                    <div className="mt-2 text-sm text-green-700">
                        {t("Kupon uygulandı:")}{" "}
                        <strong>{appliedCoupon.code}</strong> - {t("İndirim")}:
                        ₺{(discountAmount || 0).toLocaleString("tr-TR")}
                    </div>
                )}
                {couponError && (
                    <div className="mt-2 text-sm text-red-600">
                        {couponError}
                    </div>
                )}
            </div>

            <div className="mt-6 mb-6">
                <div className="info-box bg-blue-50 border border-blue-300 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <img
                            src="/svg/info2.svg"
                            alt="Info"
                            width={24}
                            height={24}
                            className="flex-shrink-0 opacity-80 mt-1"
                        />
                        <h3 className="text-blue-800 font-semibold text-base">
                            {t("Önemli Bilgilendirme")}
                        </h3>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span>✅</span>
                            <span>
                                {t(
                                    "Çıkışta herhangi bir zarar olmaması halinde depozito eksiksiz olarak iade edilir.",
                                )}
                            </span>
                        </li>
                        <li className="flex items-start gap-2 text-red-700 font-semibold">
                            <span>⚠️</span>
                            <span>
                                {t(
                                    "Depozito iadesi işletmenin politikalarına bağlıdır. Zarar veya eksik olması halinde kesinti yapılabilir.",
                                )}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Ödeme Seçenekleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                    {
                        key: "prepayment",
                        label: `${t("Ön Ödeme")} (%${prePaymentRate * 100})`,
                    },
                    { key: "full", label: t("Tümünü Öde") },
                ].map(({ key, label }) => (
                    <div
                        key={key}
                        className={`payment-option p-4 border rounded-lg cursor-pointer transition-all ${
                            paymentOption === key
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200"
                        }`}
                        onClick={() => handleOptionChange(key)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{label}</span>
                            <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                    paymentOption === key
                                        ? "border-orange-500 bg-orange-500"
                                        : "border-gray-300"
                                }`}
                            >
                                {paymentOption === key && (
                                    <div className="w-2 h-2 bg-white rounded-full m-1" />
                                )}
                            </div>
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                            ₺
                            {(key === "prepayment"
                                ? Math.round(discountedTotal * prePaymentRate)
                                : discountedTotal
                            ).toLocaleString("tr-TR")}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ödeme Yöntemleri */}
            <div className="mb-6">
                <h4 className="text-base font-medium mb-4">
                    {t("Ödeme Yöntemi")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            key: "credit_card",
                            icon: "/svg/credit-card.svg",
                            label: t("Kredi Kartı (%25 Fark)"),
                        },
                    ].map(({ key, icon, label }) => (
                        <div
                            key={key}
                            className={`payment-method p-4 border rounded-lg cursor-pointer transition-all ${
                                paymentMethod === key
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-gray-200"
                            }`}
                            onClick={() => handleMethodChange(key)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={icon}
                                    alt={label}
                                    width={32}
                                    height={32}
                                />
                                <span>{label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ödenecek Tutar */}
            <div className="flex justify-between items-center">
                <span className="text-sm">{t("Ödenecek Tutar:")}</span>
                <span className="font-semibold text-green-600">
                    ₺
                    {computeAmount(paymentOption, paymentMethod).toLocaleString(
                        "tr-TR",
                    )}
                </span>
            </div>
        </div>
    );
};

export default PaymentCard;
