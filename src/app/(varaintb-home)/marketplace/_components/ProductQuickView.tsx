"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star, Truck, Shield, RotateCcw, Heart, Share2, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { addToCart, formatNaira } from "@/components/lib/marketplace/cart";
import { toggleWishlist } from "@/components/lib/marketplace/wishlist";
import { toggleCompare, isInCompare } from "@/components/lib/marketplace/compare";
import Link from "next/link";

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    supplier: string;
    description?: string;
    type?: string;
    livestockType?: string;
    unitSize?: number;
    unitMeasure?: string;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
  };
}

export default function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Sync compare state when product changes
  React.useEffect(() => {
    setInCompare(isInCompare(product.id));
  }, [product.id]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || "https://placehold.co/600x400?text=No+Image"];

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        supplier: product.supplier,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      supplier: product.supplier,
    });
    setInWishlist(added);
  };

  const handleToggleCompare = () => {
    const added = toggleCompare({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      supplier: product.supplier,
    });
    setInCompare(added);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    window.location.href = "/marketplace/cart";
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2 p-6">
                {/* Main Image */}
                <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === idx ? "border-[#014834]" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="lg:w-1/2 p-6 lg:border-l border-gray-100">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>Home</span>
                  <span>/</span>
                  <span>Marketplace</span>
                  <span>/</span>
                  <span>{product.livestockType || "Livestock"}</span>
                  <span>/</span>
                  <span className="text-[#014834] font-medium">{product.name}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (product.rating || 4)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{product.rating || 4.7} Star Rating</span>
                  <span className="text-sm text-gray-500">({product.reviews || 21671} User feedback)</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>

                {/* Product Attributes */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{product.livestockType || "Cow"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Availability:</span>
                    <span className="text-sm font-medium text-green-600 ml-2">{product.inStock !== false ? "In Stock" : "Out of Stock"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">Live</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{product.type || "Livestock"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Sex:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">Male</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Size:</span>
                    <span className="text-sm font-medium text-gray-900 ml-2">{product.unitSize ? `${product.unitSize}${product.unitMeasure || "KG"}` : "40KG"}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">{formatNaira(product.price)}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatNaira(product.originalPrice!)}</span>
                      <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">{discount}% OFF</span>
                    </>
                  )}
                </div>

                {/* Negotiable Button */}
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors mb-4">
                  <span className="w-5 h-5 bg-[#014834] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💬</span>
                  </span>
                  Negotiable Start Chat
                </button>

                {/* Color Selector */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-900 block mb-2">Color</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-amber-600 ring-2 ring-offset-2 ring-[#014834]" />
                    <button className="w-8 h-8 rounded-full bg-gray-300 hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 transition-all" />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-medium text-gray-900">Description:</span>{" "}
                    {product.description || "Our Fulani Breed Cows are renowned for their unique characteristics that set them apart from other breeds. These majestic animals are known for their impressive size, distinctive long horns, and beautiful coat patterns that can vary in color."}
                    <button className="text-[#014834] font-medium ml-1">View More...</button>
                  </p>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-12 h-10 flex items-center justify-center font-bold text-gray-900 border-x-2 border-gray-300">
                      {String(quantity).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-colors ${
                      addedToCart
                        ? "bg-green-600 text-white"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {addedToCart ? "ADDED ✓" : "ADD TO CART"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="px-6 py-3 bg-[#014834] text-white rounded-lg font-bold text-sm hover:bg-[#013628] transition-colors"
                  >
                    BUY NOW
                  </button>
                </div>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#014834]" />
                    <span>Delivery: <span className="text-[#014834]">We deliver on time, within 3 to 7 days</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#014834]" />
                    <span>Secure Payment: <span className="text-[#014834]">Enjoy safe encrypted payments</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#014834]" />
                    <span>Returns and Refunds: <span className="text-[#014834]">Your money is safe with us</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleToggleWishlist}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#014834] transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                    <button
                      onClick={handleToggleCompare}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        inCompare ? "text-[#014834] font-medium" : "text-gray-600 hover:text-[#014834]"
                      }`}
                    >
                      <RotateCcw className={`w-4 h-4 ${inCompare ? "fill-[#014834]" : ""}`} />
                      {inCompare ? "Remove from Compare" : "Add to Compare"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Share product:</span>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Facebook className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Twitter className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Linkedin className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Instagram className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-700">100% Guarantee Safe Checkout</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((card) => (
                      <div key={card} className="px-2 py-1 bg-white rounded border border-gray-200 text-[10px] font-medium text-gray-600">
                        {card}
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Full Details Link */}
                <div className="mt-4 text-center">
                  <Link
                    href={`/marketplace/product/${product.id}`}
                    onClick={onClose}
                    className="text-[#014834] font-medium text-sm hover:underline"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
