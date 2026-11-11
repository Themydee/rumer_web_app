"use client";
import React, { useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Picture from "@/components/reusables/Picture";
import CategoryChip from "./CategryChip";
import {
  marketplaceCategories,
} from "@/components/utils/constants";
import { FilterIcon } from "@/components/utils/SVGIcons";
import VBProductCard from "./VBProductCard";
import VBCustomerExperience from "./VBCustomerExperience";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import NewsletterSection from "./VBFreeDelivery";
import VBNewsLetterSection from "../../_components/VBNewsLetterSection";
import { RumerBadge } from "@/components/utils/functions";
import {
  useMarketplaceProducts,
  getProductImage,
  getSupplierName,
  type MarketplaceProduct,
} from "@/components/hooks/useMarketplaceProducts";
import { formatNaira } from "@/components/lib/marketplace/cart";

const sectionTypes = [
  "All Livestocks Sellers",
  "Trending Products",
  "Featured Collections",
  "All Suppliers",
  "All Supermarket",
  "EcoSustain",
  "supplier",
  "supermarket",
] as const;

const VBMarketplacePage = () => {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("search") || "";
  const activeLivestockType = searchParams.get("livestockType") || "";
  const activeProductType = searchParams.get("productType") || "";
  const activeState = searchParams.get("state") || "";

  const suppliersScrollRef = useRef<HTMLDivElement>(null);
  const supermarketsScrollRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const livestockScrollRef = useRef<HTMLDivElement>(null);
  const ecoSustainScrollRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const { products, loading, error } = useMarketplaceProducts({
    search: searchQuery,
    livestockType: activeLivestockType,
    productType: activeProductType,
    state: activeState,
  });

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const scrollLeft = (scrollRef: React.RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (scrollRef: React.RefObject<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const mapProductToCard = (product: MarketplaceProduct, type: typeof sectionTypes[number]) => ({
    id: product.id,
    image: getProductImage(product),
    title: product.product_name,
    price: formatNaira(product.base_price),
    rawPrice: product.base_price,
    timeLeft: "In stock",
    rating: 4.5,
    reviews: 0,
    supplier: getSupplierName(product),
    type,
    productType: product.product_type,
    livestockType: product.livestock_type,
    description: product.description || undefined,
    unitSize: product.unit_size || undefined,
    unitMeasure: product.unit_measure || undefined,
    images: product.images || undefined,
  });

  const ScrollSection = ({
    title,
    items,
    scrollRef,
    type,
  }: {
    title: string;
    items: ReturnType<typeof mapProductToCard>[];
    scrollRef: React.RefObject<HTMLDivElement>;
    type: typeof sectionTypes[number];
  }) => {
    if (items.length === 0) return null;
    return (
      <motion.div variants={itemVariants} className="px-4 sm:px-6 py-6 w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button className="flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            See all <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => scrollLeft(scrollRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
            aria-label="Scroll left">
            <ChevronLeftIcon className="w-4 h-4 text-black-100" />
          </button>

          <button
            onClick={() => scrollRight(scrollRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
            aria-label="Scroll right">
            <ChevronRightIcon className="w-4 h-4 text-black-100" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 w-80">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <VBProductCard {...item} />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const allItems = products.map((p) => mapProductToCard(p, "All Suppliers"));
  const liveAnimals = products
    .filter((p) => p.product_type === "livestock" || p.product_type === "Live Animals")
    .map((p) => mapProductToCard(p, "All Livestocks Sellers"));
  const processed = products
    .filter((p) => p.product_type === "processed" || p.product_type === "Processed")
    .map((p) => mapProductToCard(p, "All Supermarket"));
  const trending = products.slice(0, 8).map((p) => mapProductToCard(p, "Trending Products"));
  const featured = products.slice(0, 6).map((p) => mapProductToCard(p, "Featured Collections"));
  const ecoSustain = products
    .filter((p) => p.product_type === "livestock" || p.product_type === "Live Animals")
    .slice(0, 6)
    .map((p) => mapProductToCard(p, "EcoSustain"));

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="py-20 pt-24 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-24 bg-white w-full flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="border-b border-gray-200 w-full pb-6 sm:pb-8"
      >
        <RumerBadge title="Marketplace" />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-900 mb-1">
          Get fresh produce delivered to your doorstep
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 md:gap-0">
          <p className="text-gray-600 text-sm">
            Buy & sell on your local livestock marketplace
          </p>
          <div className="flex items-center gap-2">
            {(searchQuery || activeLivestockType || activeProductType || activeState) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#014834] font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black-100 text-white rounded-lg hover:bg-black-200 transition-colors text-sm">
              <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <p>Filter</p>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      {(searchQuery || activeLivestockType || activeProductType || activeState) && (
        <motion.div variants={itemVariants} className="w-full py-3 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="px-3 py-1 bg-green-50 text-green-800 text-sm rounded-full">
              Search: {searchQuery}
            </span>
          )}
          {activeLivestockType && (
            <span className="px-3 py-1 bg-green-50 text-green-800 text-sm rounded-full">
              Category: {activeLivestockType}
            </span>
          )}
          {activeProductType && (
            <span className="px-3 py-1 bg-green-50 text-green-800 text-sm rounded-full">
              Type: {activeProductType}
            </span>
          )}
          {activeState && (
            <span className="px-3 py-1 bg-green-50 text-green-800 text-sm rounded-full">
              Location: {activeState}
            </span>
          )}
        </motion.div>
      )}

      {/* Loading / Error */}
      {loading && (
        <motion.div variants={itemVariants} className="w-full py-12 flex justify-center"
        >
          <div className="w-8 h-8 border-2 border-[#014834] border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      {error && (
        <motion.div variants={itemVariants} className="w-full py-8 text-center"
        >
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-[#014834] text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Categories */}
      {!loading && !error && (
        <motion.div
          variants={itemVariants}
          className="py-4 border-b border-gray-200 w-full"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          >
            {marketplaceCategories.map((category, index) => (
              <button
                key={index}
                onClick={() =>
                  updateParam(
                    "livestockType",
                    activeLivestockType === category.label ? "" : category.label
                  )
                }
                className={`transition-transform ${
                  activeLivestockType === category.label ? "scale-105 ring-2 ring-[#014834] rounded-xl" : ""
                }`}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <CategoryChip {...category} />
                </motion.div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <motion.div variants={itemVariants} className="w-full py-16 text-center"
        >
          <p className="text-gray-600 text-lg mb-2">No products available</p>
          <p className="text-gray-500 text-sm">
            Check back soon or adjust your filters.
          </p>
        </motion.div>
      )}

      {/* Product Sections */}
      {!loading && !error && products.length > 0 && (
        <>
          <ScrollSection
            title="All Livestocks Sellers"
            items={liveAnimals.length > 0 ? liveAnimals : allItems}
            scrollRef={livestockScrollRef}
            type="All Livestocks Sellers"
          />

          <ScrollSection
            title="Trending Products"
            items={trending}
            scrollRef={trendingScrollRef}
            type="Trending Products"
          />

          <ScrollSection
            title="Featured Collections"
            items={featured}
            scrollRef={featuredScrollRef}
            type="Featured Collections"
          />

          <ScrollSection
            title="All Suppliers"
            items={allItems}
            scrollRef={suppliersScrollRef}
            type="supplier"
          />

          <ScrollSection
            title="All Supermarket"
            items={processed.length > 0 ? processed : allItems}
            scrollRef={supermarketsScrollRef}
            type="supermarket"
          />

          <ScrollSection
            title="EcoSustain"
            items={ecoSustain}
            scrollRef={ecoSustainScrollRef}
            type="EcoSustain"
          />
        </>
      )}

      <VBCustomerExperience />
      <NewsletterSection />
      <VBNewsLetterSection />
    </motion.section>
  );
};

export default VBMarketplacePage;
