import React from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Libs/Routes/config.jsx";

const Institutional = () => {
    const { t } = useTranslation();

    return (
        <div className="institutional-page bg-gray-50 min-h-screen">
            <Header />

            {/* HERO */}
            <section
                className="
                    relative
                    overflow-hidden
                    py-24
                    bg-cover
                    bg-center
                "
                style={{
                    backgroundImage: "url('/img/banner/rentacar.png')",
                }}
            >
                <div
                    className="
                    absolute
                    inset-0
                    bg-black/70
                "
                />

                <div
                    className="
                    relative
                    z-10
                    max-w-8xl
                    mx-auto
                    px-4
                "
                >
                    <div className="max-w-3xl">
                        <span
                            className="
                            inline-flex
                            px-4
                            py-2
                            rounded-full
                            bg-orange-500/20
                            text-orange-400
                            font-semibold
                            mb-6
                        "
                        >
                            SMK Filo
                        </span>

                        <h1
                            className="
                            text-5xl
                            lg:text-6xl
                            font-black
                            text-white
                            leading-tight
                        "
                        >
                            Uzun Dönem
                            <span className="text-orange-500">
                                {" "}
                                Araç Kiralama{" "}
                            </span>
                            Çözümleri
                        </h1>

                        <p
                            className="
                            text-xl
                            text-gray-300
                            mt-6
                            leading-relaxed
                        "
                        >
                            Bireysel ve kurumsal müşteriler için esnek kilometre
                            paketleri, modern araç filosu ve avantajlı yıllık
                            kiralama çözümleri.
                        </p>

                        <div
                            className="
                            flex
                            flex-wrap
                            gap-4
                            mt-10
                        "
                        >
                            <Link
                                to="/listing"
                                className="
                                    h-[56px]
                                    px-8
                                    rounded-2xl
                                    bg-orange-500
                                    hover:bg-orange-600
                                    text-white
                                    font-bold
                                    inline-flex
                                    items-center
                                    justify-center
                                    transition
                                "
                            >
                                Araçları İncele
                            </Link>

                            <Link
                                to={ROUTES.AUTH.REGISTER}
                                className="
                                    h-[56px]
                                    px-8
                                    rounded-2xl
                                    border
                                    border-white/20
                                    hover:bg-white/10
                                    text-white
                                    font-bold
                                    inline-flex
                                    items-center
                                    justify-center
                                    transition
                                "
                            >
                                Kurumsal Başvuru
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section
                className="
                max-w-8xl
                mx-auto
                px-4
                py-20
            "
            >
                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                "
                >
                    {[
                        {
                            title: "Kurumsal Filo",
                            desc: "Şirketlere özel uzun dönem araç kiralama çözümleri.",
                        },
                        {
                            title: "Esnek KM Paketleri",
                            desc: "İhtiyacınıza göre kilometre seçenekleri.",
                        },
                        {
                            title: "Yeni Araçlar",
                            desc: "Düzenli bakımlı güncel model araç filosu.",
                        },
                        {
                            title: "7/24 Destek",
                            desc: "Operasyonel süreçlerde hızlı destek hizmeti.",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="
                                bg-white
                                rounded-3xl
                                p-8
                                border
                                border-gray-100
                                hover:border-orange-300
                                hover:shadow-xl
                                transition
                            "
                        >
                            <div
                                className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-orange-100
                                text-orange-500
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-black
                                mb-6
                            "
                            >
                                0{index + 1}
                            </div>

                            <h3
                                className="
                                text-2xl
                                font-bold
                                text-gray-900
                            "
                            >
                                {item.title}
                            </h3>

                            <p
                                className="
                                text-gray-500
                                mt-4
                                leading-relaxed
                            "
                            >
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTENT */}
            <section
                className="
                max-w-8xl
                mx-auto
                px-4
                pb-20
            "
            >
                <div
                    className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-10
                    items-center
                "
                >
                    {/* IMAGE */}
                    <div>
                        <img
                            src="/img/banner/rentacar.png"
                            alt="SMK Filo"
                            className="
                                rounded-[32px]
                                shadow-2xl
                                w-full
                                object-cover
                            "
                        />
                    </div>

                    {/* TEXT */}
                    <div>
                        <span
                            className="
                            text-orange-500
                            font-bold
                            uppercase
                            tracking-widest
                        "
                        >
                            Kurumsal Çözüm
                        </span>

                        <h2
                            className="
                            text-4xl
                            font-black
                            text-gray-900
                            mt-4
                            leading-tight
                        "
                        >
                            İşletmeniz İçin Modern Filo Yönetimi
                        </h2>

                        <p
                            className="
                            text-gray-600
                            text-lg
                            leading-loose
                            mt-6
                        "
                        >
                            SMK Filo ile operasyonel yükünüzü azaltın, sabit
                            maliyet avantajı sağlayın ve modern araç filosuna
                            kolayca erişin.
                        </p>

                        <ul
                            className="
                            mt-8
                            space-y-4
                        "
                        >
                            <li className="flex items-center gap-3">
                                <div
                                    className="
                                    w-3
                                    h-3
                                    rounded-full
                                    bg-orange-500
                                "
                                />
                                Uzun dönem araç kiralama
                            </li>

                            <li className="flex items-center gap-3">
                                <div
                                    className="
                                    w-3
                                    h-3
                                    rounded-full
                                    bg-orange-500
                                "
                                />
                                Esnek kilometre paketleri
                            </li>

                            <li className="flex items-center gap-3">
                                <div
                                    className="
                                    w-3
                                    h-3
                                    rounded-full
                                    bg-orange-500
                                "
                                />
                                Kurumsal filo yönetimi
                            </li>

                            <li className="flex items-center gap-3">
                                <div
                                    className="
                                    w-3
                                    h-3
                                    rounded-full
                                    bg-orange-500
                                "
                                />
                                Hızlı teklif ve operasyon süreci
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section
                className="
                max-w-8xl
                mx-auto
                px-4
                pb-24
            "
            >
                <div
                    className="
                    rounded-[40px]
                    overflow-hidden
                    bg-gradient-to-r
                    from-orange-500
                    to-orange-600
                    p-14
                    text-center
                "
                >
                    <h2
                        className="
                        text-4xl
                        font-black
                        text-white
                    "
                    >
                        SMK Filo ile Araç Kiralamaya Başlayın
                    </h2>

                    <p
                        className="
                        text-orange-100
                        text-xl
                        mt-5
                        max-w-2xl
                        mx-auto
                    "
                    >
                        Kurumsal filo çözümleri ve uzun dönem araç kiralama
                        avantajları için hemen bizimle iletişime geçin.
                    </p>

                    <div
                        className="
                        flex
                        justify-center
                        gap-4
                        flex-wrap
                        mt-10
                    "
                    >
                        <Link
                            to="/listing"
                            className="
                                h-[56px]
                                px-8
                                rounded-2xl
                                bg-white
                                text-orange-600
                                font-bold
                                inline-flex
                                items-center
                                justify-center
                            "
                        >
                            Araçları Gör
                        </Link>

                        <Link
                            to="/contact"
                            className="
                                h-[56px]
                                px-8
                                rounded-2xl
                                border
                                border-white/30
                                text-white
                                font-bold
                                inline-flex
                                items-center
                                justify-center
                            "
                        >
                            İletişime Geç
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Institutional;
