import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./style/App.css";

const offers = [
  { title: "Deal 1", price: "₹499", services: ["Cleanup", "Bleach", "Upperlips", "Threading", "Forehead", "D-Tan Bleach"] },
  { title: "Deal 2", price: "₹649", services: ["Bleach", "Cleanup", "Hand Wax"] },
  { title: "Deal 3", price: "₹599", services: ["Fruit Facial", "Threading", "Cleanup", "Upperlips", "Forehead", "Underarms Wax"] },
  { title: "Deal 4", price: "₹999", services: ["Hair Spa", "Hair Cut", "Threading", "Hair Wash", "Forehead"] },
  { title: "Deal 5", price: "₹2799", services: ["O3+ Facial", "Hair Cut", "Hair Wash", "Blowdry"] },
  { title: "Deal 6", price: "₹2499 - ₹2999", services: ["Hair Straightening", "Hair Smoothening", "Hair Keratin"] },
  { title: "Deal 7", price: "₹999", services: ["Wine Facial", "Manicure", "Pedicure", "Free: Threading (Upperlips, Forehead)"] },
  { title: "Deal 8", price: "₹2999", services: ["Full Leg Wax", "Under Arm Wax", "Hair Colour (with Wash)", "Multi Layer Haircut", "D-Tan"] },
];

const SpecialOffers = () => {
  const swiperRef = useRef(null);

  return (
    <section className="special-offers">
      <h2 className="special-offers-title">Special Offers</h2>

      <div className="offers-navigation">
        <button onClick={() => swiperRef.current?.slidePrev()} className="nav-arrow left-arrow">❮</button>
        <button onClick={() => swiperRef.current?.slideNext()} className="nav-arrow right-arrow">❯</button>
      </div>

      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        freeMode={true}
        grabCursor={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, FreeMode, Autoplay]}
        className="offers-swiper"
      >
        {offers.map((offer, index) => (
          <SwiperSlide key={index}>
            <div className="offer-card">
              <div className="offer-header">
                <h3 className="offer-title">{offer.title}</h3>
                <div className="price-badge">{offer.price}</div>
              </div>
              <ul className="offer-services">
                {offer.services.map((service, idx) => (
                  <li key={idx}>{service}</li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SpecialOffers;
