import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import AdvertCard from '../../../../Components/UI/Misc/AdvertCard';
import Skeleton from '@/Components/Skeleton.jsx';

const ShowcaseCarousel = ({ showcases }) => {
  const swiperRefs = useRef([]);

  // Eğer loading durumu varsa skeleton göster
  if (showcases.isLoading) {
    return (
      <>
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="mb-12" key={i}>
            <div className="title">
              <Skeleton height="24px" width="60%" className="mx-auto mb-4" />
              <Skeleton height="2px" width="80%" className="mb-6" />
            </div>
            <div className="swiper-custom grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, j) => (
                <div className="skeleton-card w-full px-4" key={j}>
                  <Skeleton height="180px" width="100%" className="mb-4" />
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
  const items = showcases.data || showcases;

  return (
    <>
      {items.map((showcase, index) => (
        <div className="mb-12" key={showcase.id || index}>
          <div className="title">
            <h2 className="text-2xl text-center font-semibold mb-4">
              {showcase.title}
            </h2>
            <div className="divider bg-gray-200 h-1" />
          </div>
          <div className="swiper-custom">
            <Swiper
              ref={el => (swiperRefs.current[index] = el)}
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              autoplay={false}
              slidesPerView="auto"
              loop
              freeMode
              navigation={{
                nextEl: `.next-button-${index}`,
                prevEl: `.prev-button-${index}`,
              }}
              breakpoints={{
                1300: { slidesPerView: 3 },
                992: { slidesPerView: 2.5 },
                520: { slidesPerView: 1.5 },
              }}
            >
              {showcase.posts.map((post, idx) => (
                <SwiperSlide key={post.id || idx}>
                  <AdvertCard data={post} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div
              className={`swiper-button-prev prev-button-${index} bg-gray-100 p-2 rounded-full shadow-md`}
              onClick={() => swiperRefs.current[index]?.swiper.slidePrev()}
            ></div>
            <div
              className={`swiper-button-next next-button-${index} bg-gray-100 p-2 rounded-full shadow-md`}
              onClick={() => swiperRefs.current[index]?.swiper.slideNext()}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ShowcaseCarousel;
