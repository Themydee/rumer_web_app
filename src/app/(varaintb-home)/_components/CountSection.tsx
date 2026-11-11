"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import Picture from "@/components/reusables/Picture";
import { sellerBgImg } from "../../../../public";

const stats = [
  { value: 50, label: "Cities", isRating: false },
  { value: 50000, label: "Transactions", isRating: false },
  { value: 3000000, label: "Users", isRating: false },
  { value: 5, label: "User Ratings", isRating: true },
] as const;

// Smart formatting: 3M+, 50K+, 50+
const formatNumber = (num: number): string => {
  if (num >= 1000000)
    return `${(num / 1000000).toFixed(1).replace(".0", "")}M+`;
  // if (num >= 1000) return `${Math.floor(num / 1000)}K+`;
  return `${num}+`;
};

const CountSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Picture
        src={sellerBgImg}
        alt="Farmers using Rumer platform"
        priority
        className="object-cover object-center"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black-100/80 via-black-100/40 to-transparent" />

      {/* Stats Content */}
      <div className="absolute inset-0 flex items-end pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="text-center">
                {/* Number */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-black-100 text-white tracking-tighter">
                  {isInView ? (
                    <CountUp
                      end={stat.value}
                      duration={3.2}
                      separator=","
                      formattingFn={(value) =>
                        stat.isRating ? "5.0" : formatNumber(value)
                      }
                      suffix=""
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  ) : (
                    <span>{stat.isRating ? "5.0" : "0"}</span>
                  )}
                </div>

                {/* Label */}
                <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-medium text-gray-200 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountSection;
