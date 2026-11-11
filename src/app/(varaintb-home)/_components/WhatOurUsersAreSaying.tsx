"use client";
import React from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import Picture from "@/components/reusables/Picture";
import { allyMasi } from "../../../../public";

const testimonials = [
  {
    quote:
      "Our children are getting improved education and we have had the freedom to go about like other people without going to beg from anyone, we're saying thank you, may God bless.",
    author: "Ally Masi",
    location: "Kaduna State, Nigeria",
    company: "Company Name",
    avatar: allyMasi,
  },
  {
    quote:
      "Rumer has transformed our operations, making it easier to manage our livestock efficiently.",
    author: "Ben Sani",
    location: "Katsina State, Nigeria",
    company: "Company Name",
    avatar: allyMasi,
  },
  {
    quote:
      "Secure, reliable, and simple — Rumer is the future for us. It has changed everything.",
    author: "Aisha Yusuf",
    location: "Kano State, Nigeria",
    company: "Company Name",
    avatar: allyMasi,
  },
  {
    quote:
      "We used to lose track of animals and payments. Now everything is clear and fast. Thank you Rumer!",
    author: "Ibrahim Bello",
    location: "Sokoto, Nigeria",
    company: "Company Name",
    avatar: allyMasi,
  },
] as const;

// Responsive card width calculation
const CARD_WIDTH = 420;
const MOBILE_CARD_WIDTH = 320;
const TOTAL_CARDS = testimonials.length;

const WhatOurUsersAreSaying = () => {
  const x = useMotionValue(0);
  const [index, setIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getCardWidth = () => (isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH);

  const handlePrev = () => {
    const prevIndex = index === 0 ? TOTAL_CARDS - 1 : index - 1;
    setIndex(prevIndex);
    animate(x, -prevIndex * getCardWidth(), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const handleNext = () => {
    const nextIndex = index === TOTAL_CARDS - 1 ? 0 : index + 1;
    setIndex(nextIndex);
    animate(x, -nextIndex * getCardWidth(), {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6 sm:gap-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl max-w-xl font-black text-gray-900 tracking-tighter leading-none">
            What Our Users Are Saying
          </h2>

          {/* Navigation Arrows */}
          <div className="flex gap-3 sm:gap-4 self-end sm:self-auto">
            <button
              onClick={handlePrev}
              disabled={index === 0 && index !== TOTAL_CARDS - 1}
              className={`transition-all duration-200 ${
                index === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-black-100 cursor-pointer"
              }`}
              aria-label="Previous testimonial">
              <RiArrowLeftLine className="text-3xl sm:text-4xl lg:text-5xl" />
            </button>

            <button
              onClick={handleNext}
              disabled={index === TOTAL_CARDS - 1 && index !== 0}
              className={`transition-all duration-200 ${
                index === TOTAL_CARDS - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black-100 hover:text-gray-900 cursor-pointer"
              }`}
              aria-label="Next testimonial">
              <RiArrowRightLine className="text-3xl sm:text-4xl lg:text-5xl" />
            </button>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-4 sm:gap-6 lg:gap-8 select-none"
            drag="x"
            dragConstraints={{
              left: -(TOTAL_CARDS - 1) * getCardWidth(),
              right: 0,
            }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full lg:max-w-lg"
                animate={{
                  scale: index === i ? 1 : 0.92,
                  opacity: index === i ? 1 : 0.6,
                }}
                transition={{ duration: 0.4 }}>
                <div className="bg-white rounded-2xl sm:rounded-3xl border-t border-r border-black-100/70 p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between gap-6 sm:gap-8 shadow-sm">
                  {/* Quote */}
                  <p className="text-sm sm:text-base lg:text-lg text-black-100/80 leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden ring-2 sm:ring-4 ring-gray-100">
                      <Picture
                        src={t.avatar}
                        alt={t.author}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                        {t.author}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                        {t.location}
                        <br />
                        {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                animate(x, -i * getCardWidth(), {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                });
              }}
              className={`transition-all duration-300 rounded-full ${
                index === i
                  ? "bg-primary-100 w-8 sm:w-12 h-2 sm:h-3"
                  : "bg-gray-300 w-2 sm:w-3 h-2 sm:h-3 hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatOurUsersAreSaying;
