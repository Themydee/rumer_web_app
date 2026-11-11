"use client";
import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";
import VCLivestockCarousel from "@/app/(variantC-home)/_components/VCLivestockCarousel";
import { Package } from "lucide-react";
import React, { useRef } from "react";
import {
  Chicken,
  Cow,
  GroupOfGoats,
  GroupOfGoats1,
  GroupOfHen,
  ManButcher,
  Turkey,
  agricHens,
  cow1,
  goat1,
  hen1,
  hens,
} from "../../../../public";
import { ProcessorHeroIcon } from "@/components/utils/SVGIcons";

const VCHeroBannerProcessor = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Livestock images for carousel
  const livestockImages = [
    { src: GroupOfGoats, alt: "Cow in the field" },
    { src: GroupOfGoats1, alt: "Dairy cow" },
    { src: GroupOfHen, alt: "Agricultural hens" },
    { src: ManButcher, alt: "Butcher" },
    { src: goat1, alt: "Goat" },
    { src: hens, alt: "Group of hens" },
    { src: hen1, alt: "Single hen" },
    { src: Turkey, alt: "Turkey" },
  ];

  // Scroll carousel left
  const handleScrollLeft = () => {
    const carousel = document.querySelector("[data-carousel]");
    if (carousel) {
      const cardWidth = carousel.querySelector("div")?.offsetWidth || 300;
      carousel.scrollBy({
        left: -(cardWidth + 24),
        behavior: "smooth",
      });
    }
  };

  // Scroll carousel right
  const handleScrollRight = () => {
    const carousel = document.querySelector("[data-carousel]");
    if (carousel) {
      const cardWidth = carousel.querySelector("div")?.offsetWidth || 300;
      carousel.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  };

  return (
    <>
      <VCHeroBanner
        badgeIcon={
          <ProcessorHeroIcon className="w-5 h-5 fill-processorheroicon-100" />
        }
        bgColorIcon="bg-processorheroicon-100/20"
        badgeText="Trusted Livestock Supply"
        title='Grow with trusted, traceable livestock supply'
        subtitle="Rumer provides processors and exporters with guaranteed, quality-assured, predictable, verifiable livestock supply, preventing rejections at port that cost you a fortune."
        buttonText="Join as a Processor or Exporter"
        buttonHref="/signup"
        showCarouselControls={false}
        showGridPattern={true}
      />

      <VCLivestockCarousel
        images={livestockImages}
        onPrevClick={handleScrollLeft}
        onNextClick={handleScrollRight}
      />
    </>
  );
};

export default VCHeroBannerProcessor;
