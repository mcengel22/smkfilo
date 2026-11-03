import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROUTES } from "../../../Libs/Routes/config";
import { API_CONFIG } from "../../../ServerSide/EndPoints";
const BlogSlide = () => {
    const isLoading = useSelector((state) => state.home.blog.loading);
    const blogs = useSelector((state) => state.home.blog.blogs);
    const { t } = useTranslation();
    const swiperRef = useRef(null);
    const BASE_URL = API_CONFIG.BASE_URL; // 🔥 endpoint config'ten alıyoruz
    if (isLoading || !blogs || blogs.length === 0) return null;

    // HTML'den düz metin çıkaran küçük yardımcı fonksiyon
    const stripHtml = (html) => {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    return (
        <div className="max-w-8xl mx-auto sm:px-2 md:px-2 px-2">
            <div className="title mb-4">
                <h2 className="text-2xl font-bold">{t("Blog")}</h2>
                <div className="divider w-20 h-1 bg-blue-500 mt-2 mb-4"></div>
            </div>

            <div className="swiper-custom relative">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Autoplay]}
                    spaceBetween={15}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    slidesPerView="auto"
                    loop={true}
                    freeMode={true}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    breakpoints={{
                        1300: {
                            slidesPerView: 3.5,
                        },
                        992: {
                            slidesPerView: 3,
                        },
                        520: {
                            slidesPerView: 2,
                        },
                        0: {
                            slidesPerView: 1.2,
                        },
                    }}
                >
                    {blogs.map((blog, index) => {
                        const cleanText = stripHtml(blog.content).slice(0, 120) + "...";
                        const imgSrc =
                            blog.image && blog.image.startsWith("http")
                                ? blog.image
                                : `${BASE_URL}${blog.image}`;
                        return (
                            <SwiperSlide key={index}>
                                <div className="card blog-list border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all bg-white">
                                    {blog.image && (
                                        <img
                                            src={imgSrc}
                                            alt={blog.title}
                                            title={blog.title}
                                            width={300}
                                            height={230}
                                            className="w-full h-52 object-cover"
                                            loading="lazy"
                                        />
                                    )}

                                    <div className="card-body p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{cleanText}</p>

                                        <Link
                                            to={`${ROUTES.UI.BLOG_DETAIL}/${blog.slug}`}
                                            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 text-sm"
                                        >
                                            {t("Daha Fazla Oku")}
                                            <i className="icon chevron-right ml-1"></i>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {/* 🔹 Swiper Navigation */}
                <div
                    className="swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/70 hover:bg-white rounded-full p-2 shadow"
                    onClick={() => swiperRef.current.swiper.slideNext()}
                ></div>
                <div
                    className="swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/70 hover:bg-white rounded-full p-2 shadow"
                    onClick={() => swiperRef.current.swiper.slidePrev()}
                ></div>
            </div>
        </div>
    );
};

export default BlogSlide;
