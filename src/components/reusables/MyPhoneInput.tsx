"use client";
import { ErrorMessage, useField } from "formik";
import PhoneInput from "react-phone-number-input";
import React from "react";
// @ts-ignore
import "react-phone-number-input/style.css";
import { FaPhone } from "react-icons/fa";
import SuccessShieldIcon from "../utils/SVGIcons";

interface MyPhoneInputProps {
  name: string;
  containerClassName?: string;
  heightClassName?: string;
  isDisabled?: boolean;
  label?: string;
  required?: boolean;
  variant?: "light" | "dark";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const MyPhoneInput = ({
  name,
  containerClassName,
  heightClassName = "h-12",
  isDisabled,
  label,
  required = false,
  variant = "light",
  icon = <SuccessShieldIcon className="w-4 h-4 fill-secondary-200" />,
  iconPosition = "right",
}: MyPhoneInputProps) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const isError = meta.touched && meta.error;

  const handleChange = (phoneValue: string | undefined) => {
    setValue(phoneValue || "");
  };

  const styles = {
    light: {
      container: "bg-gray_1-200 border-0 text-gray-900",
      input: "bg-gray_1-200 text-black-100 placeholder-gray-600",
      countrySelect: "bg-gray_1-200 text-black-100",
      label: "text-black-100",
      icon: "text-gray-400",
    },
    dark: {
      container: "bg-gray-800 border-gray-600 text-white",
      input: "bg-gray-800 text-white placeholder-gray-400",
      countrySelect: "bg-gray-700 text-gray-200",
      label: "text-white/80",
      icon: "text-gray-400",
    },
  };

  const currentStyle = styles[variant];

  return (
    <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
      {label && (
        <label className={`text-sm font-medium ${currentStyle.label}`}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {iconPosition === "left" && (
          <div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${currentStyle.icon}`}>
            {icon}
          </div>
        )}

        <div
          className={`rounded-xl overflow-hidden transition-colors px-2 ${
            currentStyle.container
          } ${
            isError
              ? "ring-2 ring-red-500"
              : "focus-within:ring-2 focus-within:ring-green-500"
          }`}>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="NG"
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            className={`w-full ${heightClassName}`}
            numberInputProps={{
              className: `w-full outline-none border-none py-3 px-4 ${
                currentStyle.input
              } ${
                iconPosition === "left"
                  ? "pl-10"
                  : iconPosition === "right"
                  ? "pr-10"
                  : ""
              }`,
            }}
            countrySelectProps={{
              className: `pr-3 ${currentStyle.countrySelect} ${
                iconPosition === "left" ? "pl-8" : ""
              }`,
            }}
          />
        </div>

        {/* Right Icon */}
        {iconPosition === "right" && (
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 ${currentStyle.icon}`}>
            {icon}
          </div>
        )}
      </div>

      <ErrorMessage
        name={name}
        component={"div"}
        className="text-red-500 text-xs text-left mt-1"
      />
    </div>
  );
};

export default MyPhoneInput;
