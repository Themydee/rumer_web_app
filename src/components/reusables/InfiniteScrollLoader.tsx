import React from "react";
import { LuLoader } from "react-icons/lu";

interface InfinityScrollLoaderProps {
	className: string;
}

const InfinityScrollLoader = ({ className }: InfinityScrollLoaderProps) => {
	return (
		<div className={`${className}`}>
			<LuLoader size={30} className={`animate-spin text-primary-100`} />
		</div>
	);
};

export default InfinityScrollLoader;
