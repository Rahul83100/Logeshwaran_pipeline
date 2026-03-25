"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { Testimonial } from "@/lib/firestore";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  return (
    <section className="testimonial tmp-section-gapTop">
      <div className="testimonial-wrapper">
        <div className="container">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop={true}
            spaceBetween={30}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="card-content-wrap">
                    <h2 className="text-doc">{testimonial.quote}</h2>
                    <h3 className="card-title">{testimonial.name}</h3>
                    <p className="card-para">{testimonial.role}</p>
                    <div className="testimonital-icon">
                      <Image
                        src="/assets/images/testimonial/testimonial-icon.svg"
                        alt="testimonial-icon"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <div className="testimonial-card-img">
                    <Image
                      className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="testimonial-btn-next-prev">
            <div className="swiper-button-next">
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <div className="swiper-button-prev">
              <i className="fa-solid fa-arrow-left"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
