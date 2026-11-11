"use client";
import React from "react";
import {motion} from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  trend: "up" | "down";
  chartData: number[];
}

const StatCard = ({ title, value, percentage, trend, chartData }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
          {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {percentage}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex items-end gap-1 h-10">
          {chartData.map((val, i) => (
            <div 
              key={i} 
              className="w-1 bg-green-100 rounded-full" 
              style={{ height: `${val}%` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
