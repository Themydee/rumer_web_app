"use client";
import React from "react";
import { RummerLogo } from "../utils/functions";
import { SOCIAL_LINKS } from "../utils/constants";
import FooterPathnames from "./FooterPathnames";
import CopyRight from "./CopyRight";
import { useQuery } from "react-query";
import { APICall } from "../utils/extras";
import { getPageDataById } from "../utils/endpoint";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  let homeId = 5;
  let contactInfoId = 173;

  const { data: homeData, isLoading: homeLoading } = useQuery(
    ["home-page"],
    async () => {
      const response = await APICall(getPageDataById, [homeId], false, false);
      return response.data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: true,
    }
  );

  const HomeData = homeData;

  const { data: contactData, isLoading: contactLoading } = useQuery(
    ["contact-page"],
    async () => {
      const response = await APICall(
        getPageDataById,
        [contactInfoId],
        false,
        false
      );
      return response.data;
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: true,
    }
  );

  const ContactData = contactData;
  return (
    <footer className="bg-secondary-200 text-white w-full px-2 lg:px-0">
      <div className="max-w-[1128px] mx-auto sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-7 lg:space-y-0 md:grid grid-cols-1 md:grid-cols-10 gap-8 lg:gap-12">
        <div className="space-y-4 col-span-4">
          <div className="flex w-full">
            <RummerLogo />
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-gray-300/80 leading-relaxed max-w-md mx-auto md:mx-0 px-4 sm:px-0">
            {HomeData?.acf?.home_video_section?.church_creed}
          </p>
        </div>

        <FooterPathnames />
      </div>
      <div className="border-t border-gray-700/50 my-4 sm:my-6 lg:my-8 max-w-[1128px] mx-auto sm:px-6 lg:px-8" />
      <div className="max-w-[1128px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <CopyRight />

        <div className="flex space-x-2 sm:space-x-3 text-gray-300 size-fit order-1 md:order-2">
          {ContactData?.acf?.socials_and_contacts && (
            <>
              {/* Facebook */}
              {ContactData?.acf?.socials_and_contacts?.facebook && (
                <a
                  href={ContactData?.acf?.socials_and_contacts?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="border border-gray-400 p-1.5 sm:p-2 rounded-full hover:border-primary-100 hover:bg-primary-100/10 transition-all duration-200 cursor-pointer group w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:scale-110 transform">
                  <FaFacebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-primary-100 transition-colors duration-200" />
                </a>
              )}

              {/* Twitter */}
              {ContactData?.acf?.socials_and_contacts?.twitter && (
                <a
                  href={ContactData?.acf?.socials_and_contacts?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="border border-gray-400 p-1.5 sm:p-2 rounded-full hover:border-primary-100 hover:bg-primary-100/10 transition-all duration-200 cursor-pointer group w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:scale-110 transform">
                  <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-primary-100 transition-colors duration-200" />
                </a>
              )}

              {/* Instagram */}
              {ContactData?.acf?.socials_and_contacts?.instagram && (
                <a
                  href={ContactData?.acf?.socials_and_contacts?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="border border-gray-400 p-1.5 sm:p-2 rounded-full hover:border-primary-100 hover:bg-primary-100/10 transition-all duration-200 cursor-pointer group w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:scale-110 transform">
                  <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-primary-100 transition-colors duration-200" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
