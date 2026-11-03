import React, { lazy, Suspense } from "react";

// react-password-strength-bar şifre sözlüğüyle birlikte ~800 KB; sadece şifre alanı olan
// sayfalarda (kayıt, şifre sıfırlama) ihtiyaç anında yüklenir.
const PasswordStrengthBar = lazy(() => import("react-password-strength-bar"));

const PasswordStrength = (props) => (
    <Suspense fallback={null}>
        <PasswordStrengthBar {...props} />
    </Suspense>
);

export default PasswordStrength;
