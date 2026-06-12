import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../Styles/MySwiper.css";

export default function MySwiper() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="MySwiper">
      {/* 🔥 MAIN SWIPER */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {/* 🎮 Spider-Man */}
        <SwiperSlide>
          <div className="slide">
            <video autoPlay muted loop playsInline className="slide-video">
              <source
                src="https://gaming-boi-tutorial2.vercel.app/spidervideo.mp4"
                type="video/mp4"
              />
            </video>

            <div className="overlay">
              <h1>Spider-Man 2</h1>
              <p>Be Greater. Together.</p>
              <button>Play Now</button>
            </div>
          </div>
        </SwiperSlide>

        {/* 🎮 Call of Duty */}
        <SwiperSlide>
          <div className="slide">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="slide-video cod-video"
            >
              <source
                src="https://gaming-boi-tutorial2.vercel.app/call-of-duty-black-ops-6-animated-hero-mobile-01-en-22may24.mp4"
                type="video/mp4"
              />
            </video>

            <div className="overlay">
              <h1>Call of Duty: Black Ops 6</h1>
              <p>Prepare for the Next Warzone Era</p>
              <button className="call">Pre-Order Now</button>
            </div>
          </div>
        </SwiperSlide>

        {/* 🎮 Cyberpunk */}
        <SwiperSlide>
          <div className="slide">
            <video autoPlay muted loop playsInline className="slide-video">
              <source
                src="https://gaming-boi-tutorial2.vercel.app/cyberpunk-2077-phantom-liberty-video-hero-01-en-11sep23.mp4"
                type="video/mp4"
              />
            </video>

            <div className="overlay">
              <h1>Cyberpunk 2077</h1>
              <p>Phantom Liberty Expansion</p>
              <button>Explore Night City</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* 🖼️ THUMBNAILS */}
      <div className="imgs">
        <img
          className={`thumb ${activeIndex === 0 ? "active" : ""}`}
          src="https://gaming-boi-tutorial2.vercel.app/_next/image?url=%2Fposter.webp&w=1080&q=75"
          onClick={() => swiperRef.current.slideTo(0)}
          alt=""
        />

        <img
          className={`thumb ${activeIndex === 1 ? "active" : ""}`}
          src="https://gaming-boi-tutorial2.vercel.app/_next/image?url=%2Fcall-of-duty-black-ops-6-hero-desktop-01-en-21may24.webp&w=1080&q=75"
          onClick={() => swiperRef.current.slideTo(1)}
          alt=""
        />

        <img
          className={`thumb ${activeIndex === 2 ? "active" : ""}`}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi5ryqlUF-K72G11baOMvL9-HfmGKOGxyuzQ&s"
          onClick={() => swiperRef.current.slideTo(2)}
          alt=""
        />
      </div>
    </div>
  );
}
