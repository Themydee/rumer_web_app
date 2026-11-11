"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings as SettingsIcon, 
  Store, 
  CheckCircle2,
  ArrowRight,
  Plus,
  Import,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/components/hooks";
import { getKycTier } from "@/components/lib/user";

const OnboardingSection = ({ title, description, progress, children, isOpen, onClick }: any) => {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4 bg-white shadow-sm">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          <ArrowRight className="rotate-90" size={20} />
        </motion.div>
      </button>
      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-gray-50/30">
          {progress && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">{progress.current}/{progress.total} Completed</span>
                <span className="text-xs text-gray-500 font-medium">{Math.round((progress.current/progress.total)*100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.current/progress.total)*100}%` }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

const OnboardingDashboard = () => {
  const [openSection, setOpenSection] = React.useState("add-products");
  const { user } = useAppSelector((state) => state.auth);
  const welcomeName =
    user?.first_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "there";

  const currentTier = getKycTier(user);
  const isBusiness = (user as any)?.business_type === "business";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#063d2e] to-[#0a5c44] rounded-3xl p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome {welcomeName}</h1>
          <p className="text-green-100 opacity-90">It's a sunny day today, we hope you're taking good care of your self 😊</p>
        </div>
        {currentTier === "tier_0" && (
          <a
            href={isBusiness ? "/business-verification" : "/kyc"}
            className="relative z-10 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Verify Identity
          </a>
        )}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* KYC Tier Status & Progression Card */}
      {currentTier === "tier_0" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-amber-900">Current KYC: Tier 0 (Basic Account)</h3>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">Unverified</span>
              </div>
              <p className="text-sm text-amber-800">
                You can browse the marketplace and record/track animals in inventory, but animal sales and receiving payments are <strong>locked</strong>. Complete Tier 1 verification (BVN + Valid ID + Liveness Check) to unlock sales.
              </p>
            </div>
          </div>
          <a
            href={isBusiness ? "/business-verification" : "/kyc"}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors flex-shrink-0 inline-block text-center w-full sm:w-auto"
          >
            Upgrade to Tier 1
          </a>
        </div>
      )}

      {currentTier === "tier_1" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-emerald-900">Current KYC: Tier 1 (Verified Individual)</h3>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-xs font-semibold">Verified</span>
              </div>
              <p className="text-sm text-emerald-800">
                You can list animals and join cooperatives. To unlock aggregated order payouts, member distribution, or unrestricted high-value direct transactions, upgrade to <strong>Tier 2 (Cooperative)</strong> or <strong>Tier 3 (Registered Business)</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/cooperative-verification"
              className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium hover:bg-emerald-100 transition-colors inline-block text-center"
            >
              Verify Cooperative (Tier 2)
            </a>
            <a
              href="/business-verification"
              className="px-4 py-2 bg-[#014834] text-white rounded-xl text-xs font-medium hover:bg-[#013628] transition-colors inline-block text-center"
            >
              Verify Business (Tier 3)
            </a>
          </div>
        </div>
      )}

      {currentTier === "tier_2" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-blue-900">Current KYC: Tier 2 (Cooperative Verified)</h3>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full text-xs font-semibold">Cooperative</span>
              </div>
              <p className="text-sm text-blue-800">
                Aggregated order payouts, member distributions, and cooperative financing access are active.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentTier === "tier_3" && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-purple-900">Current KYC: Tier 3 (Registered Business)</h3>
                <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full text-xs font-semibold">Enterprise</span>
              </div>
              <p className="text-sm text-purple-800">
                Full unrestricted payment rights, high-value enterprise direct payouts, and export supply eligibility are active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide Section */}
      <OnboardingSection 
        title="Setup guide" 
        description="Use this personalised guide to get you store up and running"
        progress={{ current: 0, total: 11 }}
        isOpen={openSection === "setup"}
        onClick={() => setOpenSection("setup")}
      >
        <div className="text-center py-8 text-gray-500">
          Follow the steps below to complete your store setup.
        </div>
      </OnboardingSection>

      {/* Add Products Section */}
      <OnboardingSection 
        title="Add products" 
        isOpen={openSection === "add-products"}
        onClick={() => setOpenSection("add-products")}
      >
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <h4 className="font-semibold text-gray-900">Add your first product</h4>
            </div>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Write a description, add photos, and set pricing for the products you plan to sell.
              <a href="#" className="text-green-600 ml-1 hover:underline">Learn more</a>
            </p>
            <div className="flex gap-3">
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 bg-[#063d2e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a5c44] transition-colors"
              >
                <Plus size={16} />
                Add Product
              </Link>
              <button
                disabled
                className="flex items-center gap-2 bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <Import size={16} />
                Import Product
              </button>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden">
              <img src="/home/manButcher.jpg" alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden">
              <img src="/home/cow.png" alt="Product" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        
        <Link
          href="/dashboard/products/manage"
          className="mt-4 p-5 border border-gray-100 rounded-2xl flex items-center justify-between bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Manage your livestock products</span>
          </div>
          <ArrowRight size={16} className="text-gray-400" />
        </Link>
      </OnboardingSection>

      {/* Setup Online Store Section */}
      <OnboardingSection 
        title="Setup up your online store" 
        isOpen={openSection === "store"}
        onClick={() => setOpenSection("store")}
      >
        <div className="py-8 text-center text-gray-500">
          Coming soon...
        </div>
      </OnboardingSection>

      {/* Store Settings Section */}
      <OnboardingSection 
        title="Store Settings" 
        isOpen={openSection === "settings"}
        onClick={() => setOpenSection("settings")}
      >
        <div className="py-8 text-center text-gray-500">
          Coming soon...
        </div>
      </OnboardingSection>

      {/* Launch Online Store Section */}
      <OnboardingSection 
        title="Launch your online store" 
        isOpen={openSection === "launch"}
        onClick={() => setOpenSection("launch")}
      >
        <div className="py-8 text-center text-gray-500">
          Coming soon...
        </div>
      </OnboardingSection>

      {/* Business Upgrade Banner */}
      <div className="bg-gradient-to-r from-[#063d2e] to-[#0a5c44] rounded-3xl p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready to grow your Business?</h2>
          <p className="text-green-100 opacity-90">Upgrade to business and unlock unlimited access to the Rumer features.</p>
        </div>
        <div className="flex gap-3 relative z-10">
          <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20">
            Learn more
          </button>
          <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2">
            <span>🎁</span>
            Upgrade to Business
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default OnboardingDashboard;
