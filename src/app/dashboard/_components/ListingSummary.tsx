"use client";
import React from "react";

interface ListingSummaryProps {
  total?: number;
  active?: number;
  sold?: number;
  draft?: number;
  pending?: number;
  statusFilter?: string[];
}

const ListingSummary = ({ 
  total = 0, 
  active = 0, 
  sold = 0, 
  draft = 0, 
  pending = 0,
  statusFilter = []
}: ListingSummaryProps) => {
  const safeTotal = total || 1;
  const activePercent = Math.round((active / safeTotal) * 100);
  const soldPercent = Math.round((sold / safeTotal) * 100);
  const draftPercent = Math.round((draft / safeTotal) * 100);
  const pendingPercent = 100 - activePercent - soldPercent - draftPercent;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const activeOffset = circumference - (activePercent / 100) * circumference;
  const soldOffset = circumference - ((activePercent + soldPercent) / 100) * circumference;
  const draftOffset = circumference - ((activePercent + soldPercent + draftPercent) / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center text-center">
      <div className="flex justify-between items-center w-full mb-8">
        <h3 className="text-gray-900 font-semibold">Listing Status Summary</h3>
        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400 cursor-help">i</div>
      </div>
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={activeOffset}
            className="text-green-500"
            strokeLinecap="round"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={soldOffset}
            className="text-gray-800"
            strokeLinecap="round"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={draftOffset}
            className="text-yellow-400"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-xs">Total Listing</span>
          <span className="text-2xl font-bold text-gray-900">{total}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className={`flex items-center gap-2 text-xs ${statusFilter.length > 0 && !statusFilter.includes("published") ? "text-gray-300" : "text-gray-500"}`}>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Active ({activePercent}%)</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${statusFilter.length > 0 && !statusFilter.includes("sold") ? "text-gray-300" : "text-gray-500"}`}>
          <div className="w-2 h-2 rounded-full bg-gray-800" />
          <span>Sold ({soldPercent}%)</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${statusFilter.length > 0 && !statusFilter.includes("draft") ? "text-gray-300" : "text-gray-500"}`}>
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span>Draft ({draftPercent}%)</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${statusFilter.length > 0 && !statusFilter.includes("pending") ? "text-gray-300" : "text-gray-500"}`}>
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Pending ({pendingPercent}%)</span>
        </div>
      </div>
    </div>
  );
};

export default ListingSummary;
