"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { RummerLogo } from "@/components/utils/functions";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";

const JoinTheFutureSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-gray-400/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 overflow-hidden">
          {/* Left Side - Dark Green Hero */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-linear-1 p-6 sm:p-8 lg:p-12 lg:py-20 lg:h-[1176px] rounded-2xl sm:rounded-3xl lg:px-14 text-white h-full flex flex-col justify-center">
            <div className="flex flex-col space-y-8 sm:space-y-10 justify-between w-full lg:w-[80%]">
              {/* Logo */}
              <RummerLogo className="h-8 sm:h-10 lg:h-12 w-auto" />

              {/* Main Headline */}
              <div className="space-y-6 sm:space-y-10">
                <h1 className="text-2xl sm:text-3xl lg:text-6xl leading-normal sm:leading-loose font-medium">
                  Join the Future of Livestock Management
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700/70 leading-relaxed max-w-lg">
                  Tell us what your business needs, and we&apos;ll find the best
                  solution for you.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {[
                  {
                    icon: FaInstagram,
                    label: "Instagram",
                  },
                  {
                    icon: FaFacebookF,
                    label: "Facebook",
                  },
                  {
                    icon: FaTwitter,
                    label: "Twitter",
                  },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-24 bg-white/10 hover:bg-white rounded-lg sm:rounded-xl flex flex-col pl-2 sm:pl-3 pr-1 py-3 sm:py-4 gap-2 sm:gap-4 shadow-xl transition-all duration-300 hover:shadow-2xl group flex-shrink-0`}
                    aria-label={social.label}>
                    <div className="bg-white/20 p-1 w-fit rounded-full flex items-center justify-center group-hover:bg-black-100">
                      <social.icon className="size-3 sm:size-3.5 group-hover:scale-110 text-white transition-transform duration-300" />
                    </div>
                    <span className="text-xs sm:text-sm group-hover:text-black-100 tracking-wide font-light">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className=" sm:p-6 lg:p-10 lg:px-16 lg:py-1 flex flex-col justify-center">
            <div className="max-w-xl mx-auto w-full">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 text-center mb-8 sm:mb-12">
                Be the first to know when our platform goes live
              </h2>

              <form className="space-y-6 sm:space-y-8">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 py-5 gap-4 sm:gap-6">
                  <Input
                    label="First Name"
                    placeholder="eg. John"
                    labelPlacement="outside"
                    variant="faded"
                    color="default"
                    classNames={{
                      label: "text-sm sm:text-base font-medium mb-2",
                      input: "text-sm sm:text-base placeholder:text-gray-500",
                      inputWrapper:
                        "bg-gray-600/20 border-transparent h-12 sm:h-14 rounded-xl",
                    }}
                  />
                  <Input
                    label="Last Name"
                    placeholder="eg. Francisco"
                    labelPlacement="outside"
                    variant="faded"
                    classNames={{
                      label: "text-sm sm:text-base font-medium mb-2",
                      input: "text-sm sm:text-base placeholder:text-gray-500",
                      inputWrapper:
                        "bg-gray-600/20 border-transparent h-12 sm:h-14 rounded-xl",
                    }}
                  />
                </div>

                {/* Email */}
                <Input
                  label="Email"
                  type="email"
                  placeholder="eg. johnfrans@gmail.com"
                  labelPlacement="outside"
                  variant="faded"
                  classNames={{
                    label: "text-sm sm:text-base font-medium mb-2",
                    input: "text-sm sm:text-base placeholder:text-gray-500",
                    inputWrapper:
                      "bg-gray-600/20 border-transparent h-12 sm:h-14 rounded-xl",
                  }}
                />

                {/* Phone Number */}
                <Input
                  label="Phone Number"
                  type="tel"
                  labelPlacement="outside"
                  placeholder="Enter Phone Number"
                  variant="faded"
                  classNames={{
                    label: "text-sm sm:text-base font-medium mb-2 ",
                    input: "text-sm sm:text-base placeholder:text-gray-500",
                    inputWrapper:
                      "bg-gray-600/20 border-transparent h-12 sm:h-14 my-4 rounded-xl",
                  }}
                />

                {/* Business Type */}
                <Select
                  label="Business Type"
                  labelPlacement="outside"
                  placeholder="Select Business Type"
                  variant="faded"
                  classNames={{
                    label: "text-sm sm:text-base font-medium mb-2",
                    trigger:
                      "bg-gray-600/20 border-transparent h-12 sm:h-14 rounded-xl",
                    value: "text-sm sm:text-base text-gray-900",
                    innerWrapper: "pt-4",
                  }}>
                  <SelectItem key="farmer">Farmer</SelectItem>
                  <SelectItem key="trader">Trader</SelectItem>
                  <SelectItem key="processor">Processor</SelectItem>
                  <SelectItem key="financial">Financial Institution</SelectItem>
                  <SelectItem key="other">Other</SelectItem>
                </Select>

                {/* Location */}
                <Input
                  label="Location"
                  placeholder="Select Physical Address"
                  labelPlacement="outside"
                  variant="faded"
                  classNames={{
                    label: "text-sm sm:text-base font-medium mb-2",
                    input: "text-sm sm:text-base placeholder:text-gray-500",
                    inputWrapper:
                      "bg-gray-600/20 border-transparent h-12 sm:h-14 my-4 rounded-xl",
                  }}
                />

                {/* How can we help? */}
                <Textarea
                  label="How can we help you?"
                  labelPlacement="outside"
                  placeholder="Enter How can we help you?"
                  variant="faded"
                  minRows={4}
                  classNames={{
                    label: "text-sm sm:text-base font-medium mb-2",
                    input: "text-sm sm:text-base placeholder:text-gray-500",
                    inputWrapper:
                      "bg-gray-600/20 border-transparent min-h-20 sm:min-h-24 rounded-xl",
                  }}
                />

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2 sm:pt-4">
                  <Button
                    size="lg"
                    variant="solid"
                    className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl bg-secondary-100 shadow-lg hover:bg-secondary-200 transition-colors">
                    Subscribe Now
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinTheFutureSection;
