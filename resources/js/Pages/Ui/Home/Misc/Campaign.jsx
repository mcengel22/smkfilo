import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import CampaignModal from "./CampaignModal";
import { useSelector } from "react-redux";

const Campaign = () => {
    const swiperRef = useRef(null);
    const { t } = useTranslation();
    const isLoading = useSelector((state) => state.home.campaign.loading);
    const campaigns = useSelector((state) => state.home.campaign.campaigns);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (campaign) => {
        setModalContent(campaign);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <section className="campaign-section">
            {isLoading ? (
                <div className="loader">
                    {[...Array(5)].map((_, index) => (
                        <div className="skeleton-item" key={index}>
                            <div className="skeleton-circle" />
                            <div className="skeleton-rect" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="swiper-outer">
                    <Swiper
                        ref={swiperRef}
                        modules={[Autoplay]}
                        spaceBetween={12}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        rewind
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                        }}
                        className="swiper-custom"
                    >
                        {campaigns.map((data, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="campaign-area"
                                    onClick={() => openModal(data)}
                                >
                                    <div className="circle">
                                        <img
                                            src={data.image?.media_url || "/img/about/kampanya.png"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/img/about/kampanya.png";
                                            }}
                                            alt={data.image?.media_title || t("kampanya")}
                                        />
                                    </div>
                                    <p className="campaign-caption">
                                        {data.title || t("Kampanya Adı")}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            <CampaignModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                content={modalContent}
            />

            {/* ===================== STYLES ===================== */}
            <style jsx>{`
                /* GENEL */
                .campaign-section {
                    width: 100%;
                    padding: 1rem 0;
                    overflow-x: hidden; /* 🔥 body kaymasını kesin keser */
                }

                .swiper-outer {
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 0 8px;
                }

                /* SWIPER */
                .swiper-custom {
                    width: 100%;
                    overflow: hidden !important;
                }

                /* ITEM */
                .campaign-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    cursor: pointer;
                    width: 100%;
                    max-width: 140px;
                    margin: 0 auto;
                }

                /* DAIRE */
                .circle {
                    width: 100%;
                    max-width: 140px;
                    aspect-ratio: 1 / 1;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff;
                    border: 4px solid orange;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .circle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                /* CAPTION */
                .campaign-caption {
                    margin-top: 8px;
                    font-size: 14px;
                    line-height: 1.2;
                    color: #333;
                    max-width: 140px;
                    word-break: break-word;
                }

                /* SKELETON */
                .loader {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }

                .skeleton-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .skeleton-circle {
                    width: 140px;
                    aspect-ratio: 1 / 1;
                    border-radius: 50%;
                    background: #e0e0e0;
                }

                .skeleton-rect {
                    width: 100px;
                    height: 18px;
                    background: #e0e0e0;
                    margin-top: 8px;
                }

                /* DESKTOP İNCE AYAR */
                @media (min-width: 1024px) {
                    .swiper-outer {
                        max-width: 900px;
                    }
                }
            `}</style>
        </section>
    );
};

export default Campaign;
