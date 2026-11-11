"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Picture from "@/components/reusables/Picture";
import { gridPattern } from "../../../../public";
import { RumerBadge } from "@/components/utils/functions";
import { RiArrowRightLine } from "react-icons/ri";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface VCHeroBannerProps {
  badgeIcon?: ReactNode;
  badgeText?: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  showCarouselControls?: boolean;
  showGridPattern?: boolean;
  className?: string;
  bgColorIcon?: string;
  rummerBadge?: boolean;
  subtitleClassName?: string;
  rummerBadgeTitle?: string;
  buttonClassName?: string;
}

const VCHeroBanner: React.FC<VCHeroBannerProps> = ({
  badgeIcon,
  badgeText,
  rummerBadge,
  title,
  subtitle,
  buttonText,
  buttonHref,
  onButtonClick,
  onPrevClick,
  onNextClick,
  showCarouselControls = true,
  showGridPattern = false,
  className = "",
  bgColorIcon = "",
  subtitleClassName = "",
  rummerBadgeTitle = "",
  buttonClassName = "",
}) => {
  // Refs for GSAP animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a master timeline for entrance animations
      const masterTL = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Background pattern animation (if present) - subtle fade in
      if (showGridPattern && sectionRef.current) {
        const pattern = sectionRef.current.querySelector('img[alt=""]');
        if (pattern) {
          gsap.fromTo(
            pattern,
            {
              opacity: 0,
            },
            {
              opacity: 0.6,
              duration: 1.2,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 90%",
              },
            },
          );
        }
      }

      // Content container animation - simple fade up
      masterTL.fromTo(
        contentRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
      );

      // Badge animation - clean and simple
      if (badgeRef.current && (badgeIcon || badgeText)) {
        masterTL.fromTo(
          badgeRef.current,
          {
            y: -20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.5",
        );
      }

      // Title animation - clean word-by-word with no excessive transforms
      const titleWords = title.split(" ");
      if (titleRef.current) {
        titleRef.current.innerHTML = "";
        titleWords.forEach((word, i) => {
          const span = document.createElement("span");
          span.className = "title-word inline-block";
          span.textContent = word + (i < titleWords.length - 1 ? "\u00A0" : "");
          span.style.opacity = "0";
          span.style.transform = "translateY(15px)";
          titleRef.current?.appendChild(span);
        });

        const words = titleRef.current.querySelectorAll(".title-word");
        gsap.to(words, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
          },
        });
      }

      // Subtitle animation - clean fade in
      masterTL.fromTo(
        subtitleRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // Button animation - subtle scale and fade
      masterTL.fromTo(
        buttonRef.current,
        {
          y: 15,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Carousel controls animation - clean slide in
      if (showCarouselControls && controlsRef.current) {
        const controls = controlsRef.current.querySelectorAll("button");
        gsap.fromTo(
          controls,
          {
            x: 30,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: controlsRef.current,
              start: "top 85%",
            },
          },
        );

        // Clean hover animations for controls
        controls.forEach((control) => {
          control.addEventListener("mouseenter", () => {
            gsap.to(control, {
              scale: 1.05,
              duration: 0.2,
              ease: "power2.out",
            });
          });

          control.addEventListener("mouseleave", () => {
            gsap.to(control, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            });
          });
        });
      }

      // Button hover effect - clean and professional
      const button = buttonRef.current?.querySelector("a, button");
      if (button) {
        button.addEventListener("mouseenter", () => {
          gsap.to(button, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out",
          });
        });

        button.addEventListener("mouseleave", () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        });
      }
    });

    return () => ctx.revert();
  }, [badgeIcon, badgeText, showCarouselControls, showGridPattern, title]);

  return (
    <div
      ref={sectionRef}
      className={`w-full bg-white text-center px-4 sm:px-6 pt-4 pb-6 md:pt-16 lg:pt-20 relative overflow-hidden ${className}`}>
      {/* Grid Pattern Background */}
      {showGridPattern && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Picture
            src={gridPattern}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 
            opacity-0 sm:opacity-70 lg:opacity-80 lg:-top-10 lg:object-contain lg:w-[1200px]"
            alt=""
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10 pt-20">
        {/* Badge */}
        {(badgeIcon || badgeText) && (
          <div ref={badgeRef} className="flex justify-center mb-4 md:mb-6">
            <div
              className={`inline-flex items-center gap-2 ${bgColorIcon}  px-4 py-2 rounded-lg shadow-sm`}>
              {badgeIcon && <span className="w-5 h-5">{badgeIcon}</span>}
              {/* {badgeText && (
                <span className="text-sm font-medium tracking-wide">
                  {badgeText}
                </span>
              )} */}
            </div>
          </div>
        )}

        {rummerBadge && (
          <div ref={badgeRef} className="flex justify-center mb-4 md:mb-6">
            <RumerBadge title={rummerBadgeTitle} />
          </div>
        )}

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-black-100 mb-4 md:mb-6 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-light text-black-200 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed ${subtitleClassName}`}>
          {subtitle}
        </p>

        {/* Button */}
        {buttonHref && (
          <div ref={buttonRef} className="mb-8">
            {onButtonClick ?
              <button
                onClick={onButtonClick}
                className={`${buttonClassName || "bg-black-100 text-white hover:bg-black-200"} px-8 py-3 md:px-5 md:py-4 rounded-lg text-sm md:text-base font-medium transition-colors duration-300 shadow-lg flex`}>
                {buttonText}
              </button>
            : <a
                href={buttonHref}
                className={`${buttonClassName || "bg-black-100 text-white hover:bg-black-200"} px-8 py-3 md:px-5 md:py-4 rounded-lg text-sm md:text-base font-inter font-medium transition-colors duration-300 shadow-lg flex items-center gap-1 justify-center w-fit mx-auto`}>
                <span>{buttonText}</span>
                <div className="">
                  <RiArrowRightLine className={`${buttonClassName ? "text-black-100" : "text-white"} text-xl`} />
                </div>
              </a>
            }
          </div>
        )}

        {/* Carousel Controls */}
        {showCarouselControls && (
          <div
            ref={controlsRef}
            className="flex items-center justify-center gap-3 md:gap-4">
            <button
              onClick={onPrevClick}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black-100 text-white flex items-center justify-center hover:bg-black-200 transition-all duration-200 shadow-md"
              aria-label="Previous">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={onNextClick}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black-100 text-white flex items-center justify-center hover:bg-black-200 transition-all duration-200 shadow-md"
              aria-label="Next">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCHeroBanner;
