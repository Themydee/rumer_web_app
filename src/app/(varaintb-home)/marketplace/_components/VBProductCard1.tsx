"use client";
import Picture from "@/components/reusables/Picture";
import { ShoppingCart, ShieldCheck, Sparkles, Truck, Star } from "lucide-react";
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";

interface VBProductCardProps {
  image: StaticImageData;
  name: string;
  price: number;
  supplier: string;
  rating: number;
  reviews: number;
}

const VBProductCard1: React.FC<VBProductCardProps> = ({
  image,
  name,
  price,
  supplier,
  rating,
  reviews,
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}>
      <div className="relative h-48 bg-gray-100">
        <Picture
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <div className="text-lg font-bold text-gray-900">
            ₦{price.toLocaleString()}
            <sup className="text-xs">.00</sup>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{supplier}</p>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VBProductCard1;
