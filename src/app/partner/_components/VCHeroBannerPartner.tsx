"use client";

import React, { useRef } from "react";
import {
  GroupOfGoats,
  GroupOfGoats1,
  GroupOfHen,
  ManButcher,
  Turkey,
  goat1,
  hen1,
  hens,
} from "../../../../public";
import VCHeroBanner from "@/app/(variantC-home)/_components/VCHeroBanner";
import { PartnerHeroIcon } from "@/components/utils/SVGIcons";
import VCLivestockCarousel from "@/app/(variantC-home)/_components/VCLivestockCarousel";

const VCHeroBannerPartner = () => {
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
          <PartnerHeroIcon className="w-5 h-5 fill-partnerheroicon-100" />
        }
        bgColorIcon="bg-partnerheroicon-100/20"
        title="De‑risk livestock investments with verified data"
        subtitle="Rumer enables financial institutions and insurers to make faster, more informed lending and underwriting decisions through verified data, digital traceability and trusted livestock records, reducing risk while unlocking new opportunities for livestock-backed finance."
        buttonText="Partner with Rumer"
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

export default VCHeroBannerPartner;
