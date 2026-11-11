"use client";
import React, { useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import ListingSummary from "./ListingSummary";
import { 
  Filter, 
  Search, 
  Plus,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";
import { useAppSelector } from "@/components/hooks";
import { getToken } from "@/components/lib/supabase/auth";

interface DashboardStats {
  user: { firstName: string; lastName: string };
  stats: {
    livestockListed: number;
    livestockSold: number;
    totalRevenue: number;
    meatRevenue: number;
    totalSales: number;
    conversionRate: number;
    productSold: number;
    availableInventory: number;
  };
  listingSummary: {
    total: number;
    active: number;
    sold: number;
    draft: number;
    pending: number;
  };
  revenueChart: { name: string; sales: number; expenses: number }[];
  statCharts: {
    livestockListed: number[];
    livestockSold: number[];
    totalRevenue: number[];
    meatRevenue: number[];
  };
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `₦${(value / 1000).toFixed(0)}k`;
  }
  return `₦${value}`;
};

const OverviewDashboard = () => {
  const [timeframe, setTimeframe] = useState("Month");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const { user } = useAppSelector((state) => state.auth);

  const displayName = stats?.user?.firstName || user?.first_name || "there";
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const response = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredRevenueChart = useMemo(() => {
    if (!stats?.revenueChart) return [];
    const all = stats.revenueChart;
    if (timeframe === "Day") {
      const currentMonth = new Date().getMonth();
      return all.slice(Math.max(0, currentMonth - 6), currentMonth + 1);
    }
    if (timeframe === "Year") {
      return [{ name: new Date().getFullYear().toString(), sales: all.reduce((s, d) => s + d.sales, 0), expenses: all.reduce((s, d) => s + d.expenses, 0) }];
    }
    return all;
  }, [stats?.revenueChart, timeframe]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#014834] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statData = stats?.stats || {
    livestockListed: 0,
    livestockSold: 0,
    totalRevenue: 0,
    meatRevenue: 0,
    totalSales: 0,
    conversionRate: 0,
    productSold: 0,
  };

  const chartData = stats?.statCharts || {
    livestockListed: [20, 40, 30, 50, 40, 60, 80],
    livestockSold: [10, 30, 20, 40, 30, 50, 70],
    totalRevenue: [40, 60, 50, 70, 60, 80, 100],
    meatRevenue: [30, 50, 40, 60, 50, 70, 90],
  };

  const statCards = [
    { title: "Livestock Listed", value: String(statData.livestockListed), percentage: "12.5%", trend: "up" as const, chartData: chartData.livestockListed },
    { title: "Livestock Sold", value: String(statData.livestockSold), percentage: "1.5%", trend: "up" as const, chartData: chartData.livestockSold },
    { title: "Total Revenue Earning", value: formatCurrency(statData.totalRevenue), percentage: "2.89%", trend: "up" as const, chartData: chartData.totalRevenue },
    { title: "Meat Revenue", value: formatCurrency(statData.meatRevenue), percentage: "2.89%", trend: "up" as const, chartData: chartData.meatRevenue },
  ];

  const visibleStatCards = statCards.filter((card) =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[#063d2e] to-[#0a5c44] rounded-3xl p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{greeting()} {displayName} 👋</h1>
          <p className="text-green-100 opacity-90">It&apos;s a sunny day today, we hope you&apos;re taking good care of your self 😊</p>
        </div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${showSearch ? "bg-[#014834] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showFilters ? "bg-[#014834] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
          {showSearch && (
            <input
              type="text"
              placeholder="Search stats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-lg border border-gray-250 focus:outline-none focus:ring-2 focus:ring-[#014834] text-sm"
              autoFocus
            />
          )}
          {showFilters && (
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-250 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#014834]"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="year">This Year</option>
              </select>
              <div className="flex flex-wrap items-center gap-2">
                {["draft", "pending", "published", "sold"].map((status) => (
                  <label key={status} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => {
                        setStatusFilter((prev) =>
                          prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-[#014834] focus:ring-[#014834]"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => {
                  setDateRange("all");
                  setStatusFilter([]);
                }}
                className="text-sm text-[#014834] hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {["Day", "Month", "Year"].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeframe === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <a
            href="/dashboard/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-[#063d2e] text-white rounded-lg text-sm font-semibold hover:bg-[#0a5c44] transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Livestock
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {visibleStatCards.map((card) => (
          <StatCard 
            key={card.title}
            title={card.title}
            value={card.value}
            percentage={card.percentage}
            trend={card.trend}
            chartData={card.chartData}
          />
        ))}
      </div>

      {/* Revenue Chart & Listing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={filteredRevenueChart} />
        </div>
        <div className="lg:col-span-1">
          <ListingSummary {...stats?.listingSummary} statusFilter={statusFilter} />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
            <span className="text-xl">📈</span>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(statData.totalSales)}</p>
            <p className="text-xs text-green-500 font-medium">2.89%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: "78%" }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Order Conversion Rate</h3>
            <span className="text-xl">🎯</span>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900">{statData.conversionRate}%</p>
            <p className="text-xs text-green-500 font-medium">2.89%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${statData.conversionRate}%` }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Product Sold</h3>
            <span className="text-xl">📦</span>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900">{statData.productSold}</p>
            <p className="text-xs text-green-500 font-medium">vs. previous month</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: "36%" }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Customer Revenue Ratio</h3>
            <span className="text-xl">👥</span>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900">5.5:1</p>
            <p className="text-xs text-green-500 font-medium">1.09%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
