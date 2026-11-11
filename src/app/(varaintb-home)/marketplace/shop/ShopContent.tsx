"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  X,
} from "lucide-react";
import { formatNaira } from "@/components/lib/marketplace/cart";
import { useMarketplaceProducts, getProductImage, getSupplierName, type MarketplaceProduct } from "@/components/hooks/useMarketplaceProducts";
import ShopProductCard from "./_components/ShopProductCard";

const categories = [
  "Livestock",
  "Processed Products",
  "Day Old Chicks",
  "Poultry Equipment",
  "Agricultural Equipment",
  "Veterinary Products",
  "Agro Processing Equipment",
  "Scales",
  "Grain Seeds",
  "Crop",
  "Agrochemicals",
];

const subCategories: Record<string, string[]> = {
  Livestock: ["All", "Cattle / Cow", "Goat", "Sheep", "Ram", "Poultry", "Fish (Live)", "Camel", "Rabbit", "Snails", "Other Livestock"],
  "Processed Products": ["Beef", "Chicken", "Fish", "Goat Meat", "Turkey"],
};

const priceRanges = [
  { label: "All Price", min: 0, max: Infinity },
  { label: "Under 2.5 K", min: 0, max: 2500 },
  { label: "2.5 - 5 K", min: 2500, max: 5000 },
  { label: "18 - 500 K", min: 18000, max: 500000 },
  { label: "500 K - 2.2 M", min: 500000, max: 2200000 },
  { label: "More than 2.2 M", min: 2200000, max: Infinity },
  { label: "Above 5 M", min: 5000000, max: Infinity },
];

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("Livestock");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState<string | null>(null);

  const productsPerPage = 12;

  const { products, loading, error } = useMarketplaceProducts({
    search: searchQuery,
  });

  const filteredProducts = products.filter((product) => {
    if (selectedSubCategory !== "All" && selectedSubCategory !== product.product_type) {
      return false;
    }
    if (selectedPriceRange > 0) {
      const range = priceRanges[selectedPriceRange];
      if (product.base_price < range.min || product.base_price > range.max) {
        return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory, selectedPriceRange, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/marketplace" className="hover:text-[#014834] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Shop</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#014834] w-64"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'fixed inset-0 z-50 bg-white lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
          {showMobileFilters && (
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="p-4 lg:p-0 lg:pr-4">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedSubCategory("All");
                        setShowSubCategoryDropdown(
                          showSubCategoryDropdown === category ? null : category
                        );
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-[#014834]/10 text-[#014834] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                    {subCategories[category] && showSubCategoryDropdown === category && (
                      <div className="ml-4 mt-1 space-y-1">
                        {subCategories[category].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubCategory(sub)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedSubCategory === sub
                                ? "text-[#014834] font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-1">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPriceRange(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedPriceRange === index
                        ? "bg-[#014834]/10 text-[#014834] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSort === option.value
                        ? "bg-[#014834]/10 text-[#014834] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                  <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
                  <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Failed to load products. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-[#014834] text-white rounded-lg font-medium hover:bg-[#013628] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#014834] text-white"
                          : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-[#014834] rounded-2xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nationwide delivery on all orders</h2>
        </div>
        <Link
          href="/marketplace"
          className="mt-4 md:mt-0 px-6 py-3 bg-white text-[#014834] rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          Shop now
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
