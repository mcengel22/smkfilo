import React, { useState, useRef, lazy } from "react";
import HomeSlider from "./Misc/HomeSlider";
import CategoryCard from "./Misc/CategoryCard";
import MobileArea from "./Misc/MobileArea";
import References from "./Misc/References";
import SectionHeading from "../../../Components/UI/Misc/SectionHeading";
import Faq from "../../../Components/UI/Misc/Faq";
import LazyOnView from "../../../Components/UI/Misc/LazyOnView";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ShowcaseCarousel from "./Misc/ShowcaseCarousel";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { setFilters } from "@/Repo/Redux/Modules/FilterSlice.jsx";
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { useNavigate } from "react-router-dom";

// Sayfanın altındaki ağır bölümler ayrı dosya olarak, ekrana yaklaşınca yüklenir
const GetQuote = lazy(() => import("./Misc/GetQuote"));
const BlogSlide = lazy(() => import("../../../Components/UI/Misc/BlogSlide"));

const Home = () => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const attrIsLoading = useSelector((state) => state.attr.loading);
    const showcaseIsLoading = useSelector(
        (state) => state.home.showcase.loading,
    );
    const popularRegionsIsLoading = useSelector(
        (state) => state.home.populerregion.loading,
    );
    const filters = useSelector((state) => state.filter.filters);
    const categories = useSelector((state) => state.attr.categories);
    const showcases = useSelector((state) => state.home.showcase.showcases);
    const popularRegions = useSelector(
        (state) => state.home.populerregion.populerregions,
    );
    const blogs = useSelector((state) => state.home.blog.blogs);
    const blogIsLoading = useSelector((state) => state.home.blog.loading);
    const navigate = useNavigate();

    const onClickCategory = (e, category) => {
        e.preventDefault();
        try {
            const filterData = {
                ...filters,
                attrs: {
                    ...filters.attrs,
                    category: [category],
                },
                pagination: { pageNumber: 1 },
            };
            dispatch(setFilters(filterData));
            localStorage.setItem("filters", JSON.stringify(filterData));
            navigate(`${ROUTES.UI.LISTING}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="home">
            {/* Anasayfa Banner*/}
            <HomeSlider />

            {/* Kampanyalar*/}
            {/* <Campaign /> */}

            {/* Araç Türleri */}
            {(attrIsLoading || categories.length > 0) && (
                <section className="home-section home-categories">
                    <div className="home-container">
                        <SectionHeading
                            eyebrow={t("Kategoriler")}
                            title={t("Araç Türleri")}
                            description={t("İhtiyacınıza uygun araç türünü seçin, size uygun araçları hemen listeleyelim.")}
                        />
                        {attrIsLoading ? (
                            <div className="text-center text-gray-500">{t("Yükleniyor...")}</div>
                        ) : (
                            <div className="category-grid">
                                {categories.map((category) => (
                                    <CategoryCard
                                        key={category.id || category.slug}
                                        category={category}
                                        onClick={onClickCategory}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Vitrin İlanlar */}
            <section className="home-section home-showcase listing vitrins-listing">
                <div className="home-container">
                    <SectionHeading
                        eyebrow={t("Filomuz")}
                        title={t("Öne Çıkan Araçlar")}
                        description={t("En çok tercih edilen araçlarımıza göz atın, size uygun olanı hemen kiralayın.")}
                    />
                    <ShowcaseCarousel showcases={showcases} />
                </div>
            </section>

            {/* Popüler Bölgeler */}
            {/* <section className="location-area">
                <div className="max-w-8xl mx-auto sm:px-2 md:px-2 px-2">
                    <div className="title">
                        <h2>{t('Şubelerimiz')}</h2>
                        <div className="divider"></div>
                    </div>
                    <div className="row">
                        <div className="destination-list-area">
                            {popularRegions.map((region, index) => (
                                <div
                                    key={index}
                                    className={`destination-list-wrap ${activeIndex === index ? "active" : ""}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <LocationCard data={region} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Çağrı bandı */}
            <section className="home-section home-cta">
                <div className="home-container">
                    <MobileArea />
                </div>
            </section>

            {/* Referanslar */}
            <References />

            {/* SSS */}
            <Faq />

            {/* Teklif Al (form kütüphaneleri ekrana yaklaşınca yüklenir) */}
            <LazyOnView minHeight={520}>
                <GetQuote />
            </LazyOnView>

            {/* Blog */}
            {!blogIsLoading && blogs && blogs.length > 0 && (
                <section className="blog">
                    <LazyOnView minHeight={360}>
                        <BlogSlide />
                    </LazyOnView>
                </section>
            )}
        </div>
    );
};

export default Home;
