"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
	steps: string[];
	currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
	return (
		<div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			{steps.map((step, index) => {
				const stepNumber = index + 1;
				const isCompleted = stepNumber < currentStep;
				const isCurrent = stepNumber === currentStep;
				const isUpcoming = stepNumber > currentStep;

				return (
					<React.Fragment key={step}>
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
									isCompleted
										? "bg-[#014834] text-white"
										: isCurrent
										? "bg-[#014834] text-white"
										: "bg-gray-200 text-gray-500"
								}`}
							>
								{isCompleted ? (
									<Check className="w-5 h-5" />
								) : (
									stepNumber
								)}
							</div>
							<span
								className={`text-sm font-medium hidden md:block ${
									isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
								}`}
							>
								{step}
							</span>
						</div>
						{index < steps.length - 1 && (
							<div
								className={`flex-1 h-px mx-4 ${
									stepNumber < currentStep ? "bg-[#014834]" : "bg-gray-200"
								}`}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default StepIndicator;
