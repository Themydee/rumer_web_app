import React from "react";
import { featureIcon1, featureIcon2, featureIcon3 } from "../../../../public";
import Picture from "@/components/reusables/Picture";

const VCFeaturedCards = () => {
  const features = [
    {
      icon: featureIcon1,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-900",
      title: "Maximise your impact",
      description:
        "Support and strengthen agricultural ecosystems by empowering sellers, driving sustainability, and fostering long-term growth in the industry.",
    },
    {
      icon: featureIcon2,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-900",
      title: "Unlock a powerful network",
      description:
        "Connect with a vast network of sellers, agribusinesses, and industry leaders to build strategic partnerships and drive meaningful change.",
    },
    {
      icon: featureIcon3,
      iconColor: "text-green-400",
      iconBg: "bg-green-900",
      title: "Leverage smart sellers management tools",
      description:
        "Gain valuable insights, track progress, and make data-driven decisions with powerful software and AI tools designed to help you manage and scale your initiatives.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="bg-black-100 rounded-3xl p-8 space-y-4 hover:scale-105 transition-transform duration-300">
              {/* Icon */}
              <div
                className={`${feature.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                <Picture
                  src={feature.icon}
                  alt=""
                  className={`w-full h-full ${feature.iconColor}`}
                />
              </div>

              {/* Title */}
              <h3 className="text-white text-xl font-bold leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-primary-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VCFeaturedCards;
