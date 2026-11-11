import React from "react";
import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";

interface CategoryChipProps {
  label: string;
  icon?: string;
  bgColor?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  bgColor = "bg-white",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl size-40 text-sm font-medium whitespace-nowrap flex-shrink-0 border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${bgColor}`}>
      {icon && (
        <div className="size-20 flex items-center justify-center">
          <img src={icon} alt={label} className="size-20 object-contain" />
        </div>
      )}
      {!icon && <span className="text-3xl font-bold text-gray-400">{label[0]}</span>}
      <span className="text-center text-xs">{label}</span>
    </div>
  );
};

export default CategoryChip;
