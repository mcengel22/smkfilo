import React, { useState, useRef } from "react";
import HomeSlider from "./Misc/HomeSlider";
import Campaign from "./Misc/Campaign";
import LocationCard from "./Misc/LocationCard";
import CategoryCard from "./Misc/CategoryCard";
import MobileArea from "./Misc/MobileArea";
import Faq from "../../../Components/UI/Misc/Faq";
import GetQuote from "./Misc/GetQuote";
import BlogSlide from "../../../Components/UI/Misc/BlogSlide";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ShowcaseCarousel from "./Misc/ShowcaseCarousel";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { setFilters } from "@/Repo/Redux/Modules/FilterSlice.jsx";
import { ROUTES } from "@/Libs/Routes/config.jsx";
import { useNavigate } from "react-router-dom";

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

            {/* Vitrin İlanlar */}
            <section className="listing vitrins-listing">
                <div className="max-w-8xl mx-auto sm:px-4 md:px-6 px-4">
                    <ShowcaseCarousel showcases={showcases} />
                </div>
            </section>

            <div className="divider bg-gray-300 h-px mx-4 my-8"></div>

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

            {/* Villa Tipleri */}
            <section className="rental-option">
                <div className="max-w-8xl mx-auto sm:px-2 md:px-2">
                    <div className="title">
                        <h2>{t("Araç Türleri")}</h2>
                        <div className="divider"></div>
                    </div>
                    {attrIsLoading ? (
                        <div className="loader">Yükleniyor</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 custom-grid px-3">
                            {categories.map((category, index) => (
                                <CategoryCard
                                    key={index}
                                    category={category}
                                    onClick={onClickCategory}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Mobil Alanı */}
            <section className="mobile-area">
                <MobileArea />
            </section>

            {/* SSS */}
            <section className="faq">
                <Faq />
            </section>

            {/* Teklif Al */}
            <div>
                <GetQuote />
            </div>

            {/* Blog */}
            {!blogIsLoading && blogs && blogs.length > 0 && (
                <section className="blog">
                    <BlogSlide />
                </section>
            )}
        </div>
    );
};

export default Home;
