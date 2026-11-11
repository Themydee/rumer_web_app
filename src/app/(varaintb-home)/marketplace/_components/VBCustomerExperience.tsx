"use client";
import React, { useRef } from "react";
import VBProductCard1 from "./VBProductCard1";
import { features, product1 } from "@/components/utils/constants";
import VBFeatureCard from "./VBFeaturedCard";
import { motion, useInView } from "framer-motion";

const VBCustomerExperience = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

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

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="max-w-7xl mx-auto  py-12 w-full">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          We provide the
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          best customer experiences
        </h2>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <VBFeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </div>

      {/* Products Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Popular</h3>
          <motion.select
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white">
            <option>Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </motion.select>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max">
            {product1.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <VBProductCard1 {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VBCustomerExperience;
