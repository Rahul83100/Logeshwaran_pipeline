"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import type { Testimonial } from "@/lib/firestore";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const arrowStyle: React.CSSProperties = {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    border: '2px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#333',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };

  return (
    <section className="testimonial tmp-section-gapTop">
      <div className="testimonial-wrapper">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

            {/* Left arrow */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous testimonial"
              style={arrowStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary, #e60000)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'var(--color-primary, #e60000)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(230, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            {/* Slider */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Swiper
                modules={[Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                loop={true}
                spaceBetween={30}
                className="testimonial-swiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '40px',
                      padding: '20px 10px',
                    }}>
                      {/* Left: Quote content */}
                      <div style={{ flex: '1 1 50%' }}>
                        <h2 style={{
                          fontSize: '26px',
                          fontWeight: 700,
                          lineHeight: 1.4,
                          color: 'var(--color-heading, #1a1a2e)',
                          marginBottom: '24px',
                          fontFamily: 'var(--font-primary, serif)',
                        }}>
                          {testimonial.quote}
                        </h2>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'var(--color-heading, #1a1a2e)',
                          marginBottom: '4px',
                        }}>
                          {testimonial.name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: 'var(--color-primary, #e60000)',
                          margin: '0 0 24px',
                        }}>
                          {testimonial.role}
                        </p>
                        {/* Pink quote icon */}
                        <svg width="60" height="48" viewBox="0 0 60 48" fill="none">
                          <path d="M0 48V28.8C0 23.2 0.8 18.2 2.4 13.8C4.13 9.4 6.53 5.8 9.6 3C12.8 0.2 16.53-0.8 20.8 0.4L22.4 6C19.2 7.2 16.53 9.2 14.4 12C12.4 14.8 11.2 18 10.8 21.6H22.4V48H0ZM33.6 48V28.8C33.6 23.2 34.4 18.2 36 13.8C37.73 9.4 40.13 5.8 43.2 3C46.4 0.2 50.13-0.8 54.4 0.4L56 6C52.8 7.2 50.13 9.2 48 12C46 14.8 44.8 18 44.4 21.6H56V48H33.6Z" fill="var(--color-primary, #e60000)" fillOpacity="0.15"/>
                        </svg>
                      </div>

                      {/* Right: Image */}
                      <div style={{ flex: '0 0 320px', maxWidth: '320px' }}>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={400}
                          height={450}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '16px',
                            width: '100%',
                            height: 'auto',
                          }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next testimonial"
              style={arrowStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary, #e60000)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'var(--color-primary, #e60000)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(230, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
