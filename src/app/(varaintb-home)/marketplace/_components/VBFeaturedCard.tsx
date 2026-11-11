"use client";
import { motion } from "framer-motion";

interface VBFeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const VBFeatureCard = ({
  icon: Icon,
  title,
  description,
}: VBFeatureCardProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-4"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}>
      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

export default VBFeatureCard;
