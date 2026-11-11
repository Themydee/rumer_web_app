"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { addToCart, formatNaira } from "@/components/lib/marketplace/cart";
import { toggleWishlist, isInWishlist } from "@/components/lib/marketplace/wishlist";
import { toggleCompare, isInCompare } from "@/components/lib/marketplace/compare";

interface Product {
  id: string;
  product_name: string;
  description: string;
  base_price: number;
  images: string[];
  livestock_type: string;
  product_type: string;
  unit_size: number;
  unit_measure: string;
  status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    farm_name: string;
  };
}

const specificationData = [
  { label: "Breed", value: "White" },
  { label: "Date of Birth", value: "12 Mar 2020 (3.5 Years)" },
  { label: "Weight", value: "850 kg" },
  { label: "Health Class", value: "Grade A+" },
  { label: "Current Location", value: "Barn B, Section 4" },
  { label: "Inventory ID (SKU)", value: "LS-ANG-992" },
  { label: "Stage Tags", value: "Premium" },
  { label: "Tag", value: "Breeding Stock" },
  { label: "Graphic Processor", value: "High Yield" },
  { label: "Number of Cores", value: "Verified" },
];

const warrantyData = [
  { label: "Warranty Summary", value: "1 Year Limited Warranty" },
  { label: "Warranty Service Type", value: "Onsite" },
  { label: "Covered in Warranty", value: "Manufacturing Defects" },
  { label: "Not Covered in Warranty", value: "Physical Damage" },
  { label: "Domestic Warranty", value: "1 Year" },
];

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "additional" | "specification" | "review">("specification");

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (product) {
      setInWishlist(isInWishlist(product.id));
      setInCompare(isInCompare(product.id));
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/marketplace/products/${resolvedParams.id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.product_name,
        price: product.base_price,
        image: product.images?.[0] || "https://placehold.co/400x300?text=No+Image",
        supplier: product.profiles?.farm_name || "Rumer Seller",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const added = toggleWishlist({
      id: product.id,
      name: product.product_name,
      price: product.base_price,
      image: product.images?.[0] || "https://placehold.co/400x300?text=No+Image",
      supplier: product.profiles?.farm_name || "Rumer Seller",
    });
    setInWishlist(added);
  };

  const handleToggleCompare = () => {
    if (!product) return;
    const added = toggleCompare({
      id: product.id,
      name: product.product_name,
      price: product.base_price,
      image: product.images?.[0] || "https://placehold.co/400x300?text=No+Image",
      supplier: product.profiles?.farm_name || "Rumer Seller",
    });
    setInCompare(added);
  };

  const handleShare = async (platform?: "facebook" | "twitter" | "linkedin") => {
    if (!product) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out ${product.product_name} on Rumer`;

    if (!platform && typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.product_name,
          text,
          url,
        });
        return;
      } catch {
        // fall back to copying link
      }
    }

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        if (typeof navigator !== "undefined") {
          await navigator.clipboard.writeText(url);
          alert("Product link copied to clipboard!");
        }
        return;
    }

    if (shareUrl && typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/marketplace/cart";
  };

  const nextImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#014834] border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace" className="px-6 py-3 bg-[#014834] text-white rounded-lg font-medium hover:bg-[#013628] transition-colors">
            Back to Marketplace
          </Link>
        </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://placehold.co/600x400?text=No+Image"];

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#014834] transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/marketplace" className="hover:text-[#014834] transition-colors">Marketplace</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/marketplace?productType=livestock" className="hover:text-[#014834] transition-colors">Livestock</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#014834] font-medium">{product.product_name}</span>
        </nav>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-[#014834]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">4.7 Star Rating</span>
              <span className="text-sm text-gray-500">(21,671 User feedback)</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>

            {/* Product Attributes */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{product.livestock_type || "Cow"}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Availability:</span>
                <span className="text-sm font-medium text-green-600 ml-2">In Stock</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Brand:</span>
                <span className="text-sm font-medium text-gray-900 ml-2">Live</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <span className="text-sm font-medium text-[#014834] ml-2">{product.product_type === "livestock" ? "Livestock" : "Processed"}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Sex:</span>
                <span className="text-sm font-medium text-gray-900 ml-2">Male</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Size:</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{product.unit_size ? `${product.unit_size}${product.unit_measure || "KG"}` : "40KG"}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">{formatNaira(product.base_price)}</span>
              <span className="text-xl text-gray-400 line-through">{formatNaira(product.base_price * 1.25)}</span>
              <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">21% OFF</span>
            </div>

            {/* Negotiable Button */}
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors mb-4">
              <MessageCircle className="w-5 h-5 text-[#014834]" />
              Negotiable Start Chat
            </button>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-900">Description:</span>{" "}
                {product.description || "Our Fulani Breed Cows are renowned for their unique characteristics that set them apart from other breeds. These majestic animals are known for their impressive size, distinctive long horns, and beautiful coat patterns that can vary in color. They are not only a symbol of strength and resilience but also play a crucial role in the livelihoods of many farmers."}
                <button className="text-[#014834] font-medium ml-1">View More...</button>
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xl"
                >
                  −
                </button>
                <span className="w-14 h-12 flex items-center justify-center font-bold text-gray-900 border-x-2 border-gray-300 text-lg">
                  {String(quantity).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xl"
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
                <ShoppingCart className="w-5 h-5" />
              </button>

              <button
                onClick={handleBuyNow}
                className="px-8 py-3 bg-[#014834] text-white rounded-lg font-bold text-sm hover:bg-[#013628] transition-colors"
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
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#014834] transition-colors"
                >
                  <RotateCcw className={`w-4 h-4 ${inCompare ? "text-[#014834]" : ""}`} />
                  {inCompare ? "Remove from Compare" : "Add to Compare"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Share product:</span>
                <button
                  onClick={() => handleShare("facebook")}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare()}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Copy product link"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 text-center mb-2">100% Guarantee Safe Checkout</p>
              <div className="flex items-center justify-center gap-2">
                {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((card) => (
                  <div key={card} className="px-3 py-1.5 bg-white rounded border border-gray-200 text-xs font-medium text-gray-600">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
            {[
              { id: "description" as const, label: "DESCRIPTION" },
              { id: "additional" as const, label: "ADDITIONAL INFORMATION" },
              { id: "specification" as const, label: "SPECIFICATION" },
              { id: "review" as const, label: "REVIEW" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-colors relative ${
                  activeTab === tab.id
                    ? "text-[#014834]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#014834]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description || "Our Fulani Breed Cows are renowned for their unique characteristics that set them apart from other breeds. These majestic animals are known for their impressive size, distinctive long horns, and beautiful coat patterns that can vary in color. They are not only a symbol of strength and resilience but also play a crucial role in the livelihoods of many farmers across West Africa."}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Each animal is carefully raised on natural pastures with proper veterinary care to ensure the highest quality. Our cattle are sourced directly from trusted farmers who follow sustainable and ethical farming practices.
                </p>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Origin</span>
                    <span className="font-medium text-gray-900">Nigeria</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Breed</span>
                    <span className="font-medium text-gray-900">Fulani</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Diet</span>
                    <span className="font-medium text-gray-900">Grass-fed</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Certification</span>
                    <span className="font-medium text-gray-900">NAFDAC Approved</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Processing</span>
                    <span className="font-medium text-gray-900">Fresh</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Shelf Life</span>
                    <span className="font-medium text-gray-900">3-5 days</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specification" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="mb-8">
                  {specificationData.map((item, index) => (
                    <div key={index} className="flex py-3 border-b border-gray-100">
                      <span className="w-48 text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">Warranty</h3>
                <div>
                  {warrantyData.map((item, index) => (
                    <div key={index} className="flex py-3 border-b border-gray-100">
                      <span className="w-48 text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "review" && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Customer reviews will appear here.</p>
                <p className="text-sm text-gray-400">Be the first to review this product.</p>
              </div>
            )}
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-[#014834] rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between">
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
