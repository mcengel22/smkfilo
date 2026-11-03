import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import AdvertCard from '../../../../Components/UI/Misc/AdvertCard';
import Skeleton from '@/Components/Skeleton.jsx';

const BREAKPOINTS = {
  520: { slidesPerView: 1.6 },
  768: { slidesPerView: 2.2 },
  1024: { slidesPerView: 3 },
  1536: { slidesPerView: 4 },
};
// Döngü için en geniş görünümdeki karttan fazla ilan olmalı (Swiper "loop" uyarısı)
const MAX_VISIBLE = 4;

const ShowcaseCarousel = ({ showcases }) => {
  // Eğer loading durumu varsa skeleton göster
  if (showcases.isLoading) {
    return (
      <>
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="showcase-group" key={i}>
            <Skeleton height="28px" width="160px" className="mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, j) => (
                <div className="skeleton-card w-full" key={j}>
                  <Skeleton height="200px" width="100%" className="mb-4" />
                  <Skeleton height="24px" width="80%" className="mb-2" />
                  <Skeleton height="16px" width="70%" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  // Showcase verilerini al (data yoksa direkt showcases array olarak bekle)
  const items = (showcases.data || showcases).filter((showcase) => showcase.posts?.length);

  return (
    <>
      {items.map((showcase, index) => (
        <div className="showcase-group" key={showcase.id || index}>
          <div className="showcase-head">
            <h3>{showcase.title}</h3>
            <div className="showcase-nav">
              <button type="button" className={`showcase-nav-btn prev-button-${index}`} aria-label="Önceki">
                <i className="icon chevron-left" />
              </button>
              <button type="button" className={`showcase-nav-btn next-button-${index}`} aria-label="Sonraki">
                <i className="icon chevron-right" />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.1}
            loop={showcase.posts.length > MAX_VISIBLE}
            navigation={{
              nextEl: `.next-button-${index}`,
              prevEl: `.prev-button-${index}`,
            }}
            breakpoints={BREAKPOINTS}
          >
            {showcase.posts.map((post, idx) => (
              <SwiperSlide key={post.id || idx}>
                <AdvertCard data={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </>
  );
};

export default ShowcaseCarousel;
