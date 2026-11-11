"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Picture from "@/components/reusables/Picture";
import React, { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface VCTestimonialProps {
	testimonialsData?: TestimonialPostType[];
}

const defaultTestimonials: TestimonialPostType[] = [
	{
		id: "1",
		databaseId: 1,
		testimonials: {
			content: "Rumer has transformed the way we source livestock. We now have greater confidence in quality, traceability and supplier verification, helping us reduce procurement risk and meet customer requirements more consistently.",
			name: "Adekunle Ajibade",
			location: "Katsina State, Nigeria",
			companyName: "Rumer Customer",
			image: { node: { sourceUrl: "/home/menSellingCows.png", altText: "Adekunle Ajibade", mediaDetails: { sizes: [] } } },
		},
	},
];

const VCTestimonial = ({ testimonialsData }: VCTestimonialProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	const testimonials = useMemo(
		() =>
			testimonialsData && testimonialsData.length > 0
				? testimonialsData
				: defaultTestimonials,
		[testimonialsData],
	);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLParagraphElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    if (isAnimating || testimonials.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
    resetAutoSlide();
  };

  const handleNext = () => {
    if (isAnimating || testimonials.length === 0) return;
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
    resetAutoSlide();
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setCurrentIndex(index);
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (autoSlideIntervalRef.current)
      clearInterval(autoSlideIntervalRef.current);
    if (!isHovering) startAutoSlide();
  };

  const startAutoSlide = () => {
    if (testimonials.length === 0) return;
    autoSlideIntervalRef.current = setInterval(() => {
      if (!isAnimating && !isHovering) {
        setCurrentIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1,
        );
      }
    }, 5000);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (autoSlideIntervalRef.current)
      clearInterval(autoSlideIntervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    startAutoSlide();
  };

  // GSAP: Animate content change when index changes
  useEffect(() => {
    if (testimonials.length === 0) return;
    if (isAnimating) return;
    setIsAnimating(true);

    if (animationRef.current) animationRef.current.kill();

    animationRef.current = gsap.timeline({
      onComplete: () => setIsAnimating(false),
      defaults: { ease: "power2.inOut" },
    });

    animationRef.current
      .to(
        [
          quoteRef.current,
          nameRef.current,
          locationRef.current,
          companyRef.current,
        ],
        {
          opacity: 0,
          y: 10,
          duration: 0.2,
        },
      )
      .to(imageRef.current, { scale: 0.95, opacity: 0.5, duration: 0.2 }, "<")
      .to(imageRef.current, { scale: 1, opacity: 1, duration: 0.3 })
      .to(
        [
          quoteRef.current,
          nameRef.current,
          locationRef.current,
          companyRef.current,
        ],
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
        },
        "-=0.2",
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, testimonials.length]);

  // GSAP: Initial scroll reveal
  useEffect(() => {
    if (testimonials.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        imageRef.current,
        { x: -30, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8 },
      );
      tl.fromTo(
        contentCardRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.5",
      );
    });

    startAutoSlide();
    return () => {
      ctx.revert();
      if (autoSlideIntervalRef.current)
        clearInterval(autoSlideIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  // Safety check: If no data is provided, don't render
  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex].testimonials;

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 md:px-16 md:py-20 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-10 gap-6 h-full lg:h-[600px] md:gap-12 items-stretch">
          {/* Dynamic Image */}
          <div className="md:col-span-3 flex justify-center items-center order-1 md:order-none">
            <div
              ref={imageRef}
              className="relative w-[95%] sm:w-full h-[250px] md:h-[300px] lg:h-[500px] rounded-md lg:rounded-3xl overflow-hidden transform-gpu">
              <Picture
                src={current.image?.node?.sourceUrl}
                alt={current.name}
                className="w-full h-full object-cover rounded-md lg:rounded-none"
              />

              {/* Mobile Dot Indicators */}
              <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Content Card */}
          <div
            ref={contentCardRef}
            className="bg-vctestimonial-100 rounded-3xl p-6 md:p-10 lg:px-10 lg:py-14 md:col-span-7 flex flex-col justify-between min-h-[350px] md:min-h-[400px] order-2 transform-gpu">
            <p
              ref={quoteRef}
              className="text-lg md:text-xl lg:text-3xl font-inter font-light text-black-100 leading-relaxed mb-6">
              &quot;{current.content}&quot;
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-auto gap-6 md:gap-0">
              <div className="space-y-2 md:space-y-1 font-inter">
                <p ref={nameRef} className="font-bold text-lg md:text-xl">
                  {current.name}
                </p>
                <div
                  ref={locationRef}
                  className="font-semibold text-base md:text-lg lg:text-xl text-gray-900">
                  {current.location}
                </div>
                <p
                  ref={companyRef}
                  className="text-black-100/70 text-base md:text-lg">
                  {current.companyName}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-normal w-full md:w-auto">
                {/* Desktop Indicators */}
                <div className="hidden md:flex items-center gap-2 mr-6">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? "bg-gray-900 w-6" : (
                          "bg-gray-900/30"
                        )
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={isAnimating}
                    className="p-2 hover:bg-black/5 rounded-full transition-all disabled:opacity-30">
                    <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isAnimating}
                    className="p-2 hover:bg-black/5 rounded-full transition-all disabled:opacity-30">
                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VCTestimonial;
