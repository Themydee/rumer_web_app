"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Eye, RotateCcw } from "lucide-react";
import { formatNaira, addToCart } from "@/components/lib/marketplace/cart";
import { toggleWishlist } from "@/components/lib/marketplace/wishlist";
import { toggleCompare, isInCompare } from "@/components/lib/marketplace/compare";
import { getProductImage, getSupplierName, type MarketplaceProduct } from "@/components/hooks/useMarketplaceProducts";
import ProductQuickView from "../../_components/ProductQuickView";

interface ShopProductCardProps {
  product: MarketplaceProduct;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const image = getProductImage(product);
  const supplier = getSupplierName(product);

  useEffect(() => {
    setInCompare(isInCompare(product.id));
    const handleUpdate = () => setInCompare(isInCompare(product.id));
    window.addEventListener("rumer-compare-updated", handleUpdate);
    return () => window.removeEventListener("rumer-compare-updated", handleUpdate);
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.product_name,
      price: product.base_price,
      image,
      supplier,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist({
      id: product.id,
      name: product.product_name,
      price: product.base_price,
      image,
      supplier,
    });
    setInWishlist(added);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleCompare({
      id: product.id,
      name: product.product_name,
      price: product.base_price,
      image,
      supplier,
    });
    setInCompare(added);
  };

  return (
    <>
      <motion.div
        className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 w-full"
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        <Link href={`/marketplace/product/${product.id}`} className="block">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            <img
              src={image}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />

            {/* Discount Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-[#014834] text-white text-xs font-bold rounded">
              SALE
            </div>

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleWishlist}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  inWishlist ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
              </button>
              <button
                onClick={handleToggleCompare}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  inCompare ? "bg-[#014834] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToCart}
                className="w-9 h-9 rounded-full bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center shadow-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-[#014834] text-white hover:bg-[#013628] flex items-center justify-center shadow-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(56,787)</span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {product.product_name}
            </h3>

            {/* Supplier */}
            <p className="text-xs text-gray-500 mb-2">{supplier}</p>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatNaira(product.base_price)}
                <span className="text-xs font-normal text-gray-500">.00</span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      <ProductQuickView
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={{
          id: product.id,
          name: product.product_name,
          price: product.base_price,
          image,
          supplier,
          description: product.description || undefined,
          livestockType: product.livestock_type || undefined,
          unitSize: product.unit_size || undefined,
          unitMeasure: product.unit_measure || undefined,
          rating: 4,
          reviews: 56787,
          inStock: true,
        }}
      />
    </>
  );
}
