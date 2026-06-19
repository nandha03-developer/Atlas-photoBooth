import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

const Carousel = () => {
  return (
    <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
      >
        <SwiperSlide style={{ backgroundColor: '#E57373' }}>1</SwiperSlide>
        <SwiperSlide style={{ backgroundColor: '#F06292' }}>2</SwiperSlide>
        <SwiperSlide style={{ backgroundColor: '#BA68C8' }}>3</SwiperSlide>
        <SwiperSlide style={{ backgroundColor: '#64B5F6' }}>4</SwiperSlide>
        <SwiperSlide style={{ backgroundColor: '#4DB6AC' }}>5</SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;