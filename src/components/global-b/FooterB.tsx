"use client";
import React from "react";
import Link from "next/link";
import { RummerLogo } from "../utils/functions";
import { FaArrowRightLong } from "react-icons/fa6";
import Picture from "../reusables/Picture";
import { rayWork } from "../../../public";

import { FOOTER_LINKS } from "../utils/Bconstants";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
});

const FooterB = () => {
  const router = useRouter();
  return (
    <footer
      className={`bg-gray-200 text-white overflow-hidden ${inter.className}`}>
      <div className="mx-auto px-3 lg:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Section - CTA */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-12 lg:space-y-18 bg-primary-100 rounded-2xl sm:rounded-3xl py-6 sm:py-8 lg:py-10 px-6 sm:px-8 relative overflow-hidden">
            <div className="space-y-3 sm:space-y-4">
              <h2
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-sm font-bold leading-tight sm:leading-snug`}>
                Building trust into livestock supply chains.
              </h2>
              <p className="text-base sm:text-lg text-gray-400/80 max-w-md">
                Solutions for every part of agriculture.
              </p>
            </div>

			<button
				onClick={() => router.push("/signup")}
				className="bg-secondary-100 text-black-100 group font-semibold px-5 sm:px-6 py-3 sm:py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 text-sm sm:text-base w-full sm:w-auto justify-center cursor-pointer">
				<span>Get Started</span>
				<FaArrowRightLong className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
			</button>

            <Picture
              src={rayWork}
              alt="rey"
              className="size-32 sm:size-40 lg:size-56 absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 -right-4 sm:-right-8 lg:right-0 opacity-80 lg:opacity-100"
            />
          </div>

          {/* Right Section: Footer Links */}
          <div className="lg:col-span-7 bg-primary-300 text-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:px-8 lg:py-8 flex flex-col w-full justify-between gap-8 sm:gap-10">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {FOOTER_LINKS.map((section) => (
                <div key={section.title}>
                  <h4 className="font-medium text-base sm:text-lg mb-4 sm:mb-6 text-gray-500">
                    {section.title}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 font-sf-pro">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="hover:text-green-700 text-black-100 transition duration-200 text-sm sm:text-base">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="xs:col-span-2 md:col-span-1 flex justify-start md:justify-center lg:justify-start">
                <RummerLogo isGreen className="w-32 sm:w-40 lg:w-auto" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-black-100/70 font-medium">
                <div className="relative group cursor-not-allowed">
                  <span className="hover:text-green-700 transition">
                    Privacy Policy
                  </span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black-100 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Coming Soon
                  </span>
                </div>
                <span className="text-lg hidden sm:block">•</span>
                <div className="relative group cursor-not-allowed">
                  <span className="hover:text-green-700 transition">
                    Terms of Use
                  </span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black-100 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Coming Soon
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                © 2025 with rumer
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterB;
