import Link from "next/link";
import {
	BuyerSvgIcon,
	FarmerSvgIcon,
	FinancialSvgIcon,
	ProcessorSvgIcon,
	ServiceSvgIcon,
} from "../utils/SVGIcons";

interface SolutionPillsProps {
	compact?: boolean;
}

const SolutionPills = ({ compact = false }: SolutionPillsProps) => {
	const solutions = [
		{
			label: "Farmers",
			icon: FarmerSvgIcon,
			href: "/producer",
			color: "text-secondaryTwo-600",
			bg: "bg-secondaryTwo-100",
		},
		{
			label: "Processors & Exporters",
			icon: ProcessorSvgIcon,
			href: "/processor",
			color: "text-secondaryTwo-700",
			bg: "bg-secondaryTwo-200",
		},
		{
			label: "Buyers",
			icon: BuyerSvgIcon,
			href: "/buyer",
			color: "text-secondaryTwo-800",
			bg: "bg-secondaryTwo-300",
		},
		{
			label: "Financial Institutions",
			icon: FinancialSvgIcon,
			href: "/partner",
			color: "text-secondaryTwo-900",
			bg: "bg-secondaryTwo-400",
		},
		{
			label: "Third-Party Service Providers",
			icon: ServiceSvgIcon,
			href: "/third-party-service-providers",
			color: "text-secondaryTwo-950",
			bg: "bg-secondaryTwo-500",
		},
	];

	return (
		<div className={compact ? "space-y-2" : "space-y-3"}>
			{solutions.map((item) => {
				const Icon = item.icon;
				return (
					<Link
						href={item.href}
						key={item.label}
						className={`flex items-center gap-2 transition-[.4] ${
							compact
								? "pl-1.5 pr-3 py-1.5 rounded-xl"
								: "pl-2 pr-5 py-4 rounded-2xl"
						} ${item.bg} shadow-sm hover:scale-105 cursor-pointer`}
					>
						<div
							className={`flex items-center justify-center rounded-xl bg-white p-3`}
						>
							<Icon
								className={`${compact ? "size-5" : "size-6"} ${item.color}`}
							/>
						</div>
						<span
							className={`${
								compact ? "text-sm" : ""
							} text-black-100 font-medium`}
						>
							{item.label}
						</span>
					</Link>
				);
			})}
		</div>
	);
};

export default SolutionPills;
