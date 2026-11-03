import React from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header />

            <section className="about-page bg-gray-50">
                {/* HERO */}
                <div
                    className="
                    relative
                    overflow-hidden
                    bg-gradient-to-r
                    from-gray-900
                    to-black
                    py-24
                "
                >
                    <div
                        className="
                        max-w-8xl
                        mx-auto
                        px-4
                        relative
                        z-10
                    "
                    >
                        <div className="max-w-3xl">
                            <span
                                className="
                                inline-flex
                                items-center
                                px-4
                                py-2
                                rounded-full
                                bg-orange-500/20
                                text-orange-400
                                text-sm
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
                                Kurumsal Araç
                                <span className="text-orange-500">
                                    {" "}
                                    Kiralama{" "}
                                </span>
                                ve Filo Çözümleri
                            </h1>

                            <p
                                className="
                                text-gray-300
                                text-xl
                                mt-6
                                leading-relaxed
                            "
                            >
                                SMK Filo olarak bireysel ve kurumsal
                                müşterilerimize uzun dönem araç kiralama, filo
                                yönetimi ve esnek kullanım çözümleri sunuyoruz.
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
                                    to="/Ilanlar"
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

                                {/* <Link
                                    to="/contact"
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
                                    Teklif Al
                                </Link> */}
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                        absolute
                        right-0
                        top-0
                        w-[500px]
                        h-[500px]
                        bg-orange-500/10
                        blur-3xl
                        rounded-full
                    "
                    />
                </div>

                {/* CONTENT */}
                <div
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
                        lg:grid-cols-2
                        gap-16
                        items-center
                    "
                    >
                        {/* LEFT */}
                        <div>
                            <span
                                className="
                                text-orange-500
                                font-bold
                                uppercase
                                tracking-widest
                            "
                            >
                                Hakkımızda
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
                                Türkiye’nin Yeni Nesil Filo Yönetim Platformu
                            </h2>

                            <p
                                className="
                                text-gray-600
                                mt-6
                                leading-loose
                                text-lg
                            "
                            >
                                SMK Filo, uzun dönem araç kiralama ve filo
                                yönetimi alanında modern çözümler sunmak
                                amacıyla kurulmuştur. Geniş araç portföyümüz,
                                esnek kilometre paketlerimiz ve kurumsal
                                altyapımız ile kullanıcılarımıza güvenilir bir
                                kiralama deneyimi sunuyoruz.
                            </p>

                            <div
                                className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-5
                                mt-10
                            "
                            >
                                <div
                                    className="
                                    bg-white
                                    rounded-3xl
                                    p-6
                                    shadow-sm
                                    border
                                    border-gray-100
                                "
                                >
                                    <h3
                                        className="
                                        text-3xl
                                        font-black
                                        text-orange-500
                                    "
                                    >
                                        7/24
                                    </h3>

                                    <p
                                        className="
                                        text-gray-600
                                        mt-2
                                    "
                                    >
                                        Destek Hizmeti
                                    </p>
                                </div>

                                <div
                                    className="
                                    bg-white
                                    rounded-3xl
                                    p-6
                                    shadow-sm
                                    border
                                    border-gray-100
                                "
                                >
                                    <h3
                                        className="
                                        text-3xl
                                        font-black
                                        text-orange-500
                                    "
                                    >
                                        %100
                                    </h3>

                                    <p
                                        className="
                                        text-gray-600
                                        mt-2
                                    "
                                    >
                                        Şeffaf Fiyatlandırma
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="relative">
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

                            <div
                                className="
                                absolute
                                -bottom-8
                                -left-8
                                bg-white
                                rounded-3xl
                                shadow-xl
                                p-6
                                border
                                border-gray-100
                                max-w-[260px]
                            "
                            >
                                <h4
                                    className="
                                    text-2xl
                                    font-black
                                    text-gray-900
                                "
                                >
                                    Uzun Dönem
                                </h4>

                                <p
                                    className="
                                    text-gray-500
                                    mt-2
                                "
                                >
                                    Esnek yıllık kullanım paketleri ve kurumsal
                                    filo çözümleri
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FEATURES */}
                    <div className="mt-28">
                        <div className="text-center mb-14">
                            <span
                                className="
                                text-orange-500
                                font-bold
                                uppercase
                                tracking-widest
                            "
                            >
                                Avantajlar
                            </span>

                            <h2
                                className="
                                text-4xl
                                font-black
                                text-gray-900
                                mt-4
                            "
                            >
                                Neden SMK Filo?
                            </h2>
                        </div>

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
                                    title: "Kurumsal Çözüm",
                                    desc: "Şirketlere özel filo yönetimi ve araç kiralama çözümleri.",
                                },
                                {
                                    title: "Esnek KM Paketleri",
                                    desc: "İhtiyacınıza uygun kilometre seçenekleri.",
                                },
                                {
                                    title: "Yeni Model Araçlar",
                                    desc: "Düzenli bakımlı güncel araç filosu.",
                                },
                                {
                                    title: "Hızlı Destek",
                                    desc: "Satış sonrası hızlı destek ve operasyon yönetimi.",
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
                                        text-xl
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
                    </div>

                    {/* CTA */}
                    <div
                        className="
                        mt-28
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
                            Filonuzu Bugün Oluşturun
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
                            SMK Filo ile uzun dönem araç kiralama süreçlerinizi
                            dijitalleştirin ve operasyonel yükünüzü azaltın.
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
                                Bizimle İletişime Geçin
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
