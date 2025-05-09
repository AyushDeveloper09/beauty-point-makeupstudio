import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style/SpecialOffers.css';

const SpecialOffers = () => {
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  
  // Special offers data from the image (Deal 1-8)
  const offers = [
    {
      id: 1,
      title: "Deal 1",
      price: "₹499",
      services: [
        "1. Cleanup",
        "2. U-Lips",
        "3. Threading",
        "4. Forehead",
        "5. D-tan Bleach"
      ]
    },
    {
      id: 2,
      title: "Deal 2",
      price: "₹649",
      services: [
        "1. Bleach",
        "2. Cleanup",
        "3. Hand Wax"
      ]
    },
    {
      id: 3,
      title: "Deal 3",
      price: "₹599",
      services: [
        "1. Fruit Facial",
        "2. Threading",
        "3. U-Lips",
        "4. Forehead",
        "5. Underarms Wax"
      ]
    },
    {
      id: 4,
      title: "Deal 4",
      price: "₹999",
      services: [
        "1. Hair Spa",
        "2. Cleanup",
        "3. Threading",
        "4. U-Lips",
        "5. Forehead"
      ]
    },
    {
      id: 5,
      title: "Deal 5",
      price: "₹1999",
      services: [
        "1. O+3 Facial",
        "2. Hair Cut",
        "3. Hair Wash",
        "4. Blowdry"
      ]
    },
    {
      id: 6,
      title: "Deal 6",
      price: "₹2499",
      services: [
        "Hair Offers",
        "Hair Straightening",
        "Price - ₹2499/-"
      ]
    },
    {
      id: 7,
      title: "Deal 7",
      price: "₹1999",
      services: [
        "Wine Facial",
        "Manicure, Pedicure",
        "Threading",
        "U-Lips, Forehead"
      ]
    },
    {
      id: 8,
      title: "Deal 8",
      price: "₹2999",
      services: [
        "Full Leg Wax",
        "Full Hand Wax",
        "Under Arms",
        "Multi Layer Haircut",
        "D-Tan"
      ]
    }
  ];

  const handleBookNow = () => {
    navigate("/book-appointment");
  };

  return (
    <section className="special-offers">
      <h2 className="special-offers-title">OUR SPECIAL PACKAGES</h2>
      
      <div className="offers-navigation">
        <button ref={prevRef} className="nav-arrow prev-arrow">❮</button>
        <button ref={nextRef} className="nav-arrow next-arrow">❯</button>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Default for mobile
        breakpoints={{
          // when window width is >= 640px (small screens)
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // when window width is >= 768px (medium screens)
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // when window width is >= 1024px (large screens)
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        loop={true}
        centeredSlides={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="offers-swiper"
      >
        {offers.map((offer) => (
          <SwiperSlide key={offer.id}>
            <div className="offer-card">
              <div className="offer-content">
                <div className="offer-header">
                  <h3 className="offer-title">{offer.title}</h3>
                  <span className="price-badge">{offer.price}</span>
                </div>
                
                <ul className="offer-services">
                  {offer.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
                
                <button className="book-now-btn" onClick={handleBookNow}>Book Now</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SpecialOffers;