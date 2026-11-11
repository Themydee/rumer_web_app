"use client";
import React, { useState, useEffect } from "react";
import Picture from "@/components/reusables/Picture";
import {
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { StaticImageData } from "next/image";
import { BsGift } from "react-icons/bs";
import { TruckIcon } from "@/components/utils/SVGIcons";
import { motion } from "framer-motion";
import { addToCart } from "@/components/lib/marketplace/cart";
import { toggleWishlist } from "@/components/lib/marketplace/wishlist";
import { toggleCompare, isInCompare } from "@/components/lib/marketplace/compare";
import { RotateCcw } from "lucide-react";
import ProductQuickView from "./ProductQuickView";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  image: StaticImageData | string;
  title: string;
  price: string;
  rawPrice: number;
  timeLeft: string;
  rating: number;
  reviews: number;
  supplier: string;
  isOutOfStock?: boolean;
  discount?: string;
  type:
    | "supplier"
    | "supermarket"
    | "Trending Products"
    | "Featured Collections"
    | "All Livestocks Sellers"
    | "EcoSustain"
    | "All Suppliers"
    | "All Supermarket";
  productType?: string;
  livestockType?: string | null;
  description?: string;
  unitSize?: number;
  unitMeasure?: string;
  originalPrice?: number;
  images?: string[];
}

const VBProductCard = ({
  id,
  image,
  title,
  price,
  rawPrice,
  timeLeft,
  rating,
  reviews,
  supplier,
  isOutOfStock,
  discount,
  type,
  productType,
  livestockType,
  description,
  unitSize,
  unitMeasure,
  originalPrice,
  images,
}: ProductCardProps) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    setInCompare(isInCompare(id));
    const handleUpdate = () => setInCompare(isInCompare(id));
    window.addEventListener("rumer-compare-updated", handleUpdate);
    return () => window.removeEventListener("rumer-compare-updated", handleUpdate);
  }, [id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      id,
      name: title,
      price: rawPrice,
      image: typeof image === "string" ? image : "",
      supplier,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist({
      id,
      name: title,
      price: rawPrice,
      image: typeof image === "string" ? image : "",
      supplier,
    });
    setInWishlist(added);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleCompare({
      id,
      name: title,
      price: rawPrice,
      image: typeof image === "string" ? image : "",
      supplier,
    });
    setInCompare(added);
  };

  const handleCardClick = () => {
    setQuickViewOpen(true);
  };

  const renderActionButton = () => {
    if (isOutOfStock) {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg text-white font-medium z-10">
          Out of Stock
        </div>
      );
    }

    if (type === "supermarket" || type === "All Supermarket") {
      return (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-md transition-shadow z-10">
          <ShoppingCartIcon className="w-5 h-5 text-green-600" />
        </motion.button>
      );
    }

    return null;
  };

  return (
    <>
      <motion.div
        className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 w-full"
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
      >
        <Link href={`/marketplace/product/${id}`} className="block">
          <div className="relative">
            {/* Fixed: Remove rounded corners from image container */}
            <div className="w-full h-48 overflow-hidden">
              <Picture
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {renderActionButton()}

            {discount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 bg-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm z-10">
                <span className="text-lg">
                  <BsGift className="size-6 text-black-100" />
                </span>
                <span className="text-black-100">{discount}</span>
              </motion.div>
            )}

            {/* Quick View Button */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
                className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              >
                <EyeIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Compare Button */}
            <div className="absolute top-2 left-14 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleCompare}
                className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors z-10 ${
                  inCompare
                    ? "bg-[#014834] text-white hover:bg-[#013628]"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1 pr-2">
                {title}
              </h3>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className="cursor-pointer"
              >
                <HeartIcon
                  className={`size-6 flex-shrink-0 transition-colors ${
                    inWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-600">
                  <TruckIcon className="fill-gray-300" />
                </span>
                <span>
                  From <span className="font-semibold text-gray-900">{price}</span>{" "}
                  | {timeLeft}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900">{rating}</span>
                <span className="text-sm text-gray-500">({reviews})</span>
              </div>
            </div>

            {type && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`mt-2 flex items-center justify-start w-fit gap-2 border py-2 px-4 rounded-full transition-colors text-sm font-medium ${
                  addedToCart
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-white border-gray-300 text-black-100 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingCartIcon className={`w-4 h-4 ${addedToCart ? "text-green-600" : ""}`} />
                {addedToCart ? "Added" : "Add to Cart"}
              </motion.button>
            )}
          </div>
        </Link>
      </motion.div>

      <ProductQuickView
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={{
          id,
          name: title,
          price: rawPrice,
          originalPrice,
          image: typeof image === "string" ? image : "",
          images,
          supplier,
          description,
          livestockType: livestockType || undefined,
          unitSize,
          unitMeasure,
          rating,
          reviews,
          inStock: !isOutOfStock,
        }}
      />
    </>
  );
};

export default VBProductCard;
