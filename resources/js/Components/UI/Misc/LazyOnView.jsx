import React, { Suspense, useEffect, useRef, useState } from "react";

// Sayfanın alt kısımlarındaki ağır bölümleri (form, slider) ekrana yaklaşınca yükler.
// İçine React.lazy ile yüklenen bir bileşen verilir; o zamana kadar yer tutucu gösterilir.
const LazyOnView = ({ children, minHeight = 400, rootMargin = "600px" }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible || !ref.current) return;

        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [visible, rootMargin]);

    const placeholder = <div style={{ minHeight }} aria-hidden="true" />;

    return (
        <div ref={ref}>
            {visible ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}
        </div>
    );
};

export default LazyOnView;
