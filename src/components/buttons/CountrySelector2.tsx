"use client";
import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { BsChevronDown } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi2";

const CountrySelector2 = () => {
	const [selected, setSelected] = useState("NG");

	return (
		<div className='inline-flex items-center justify-between px-1 lg:px-2 py-0.5 lg:py-1 bg-primary-300 rounded-md border border-primary-300 shadow-sm'>
			{/* Nigerian Flag Circle */}
			<div className='flex-shrink-0 size-3 lg:size-5 rounded-full overflow-hidden shadow-sm mr-1'>
				<div className='w-full h-full flex'>
					<div className='w-1/3 bg-primary-800' />
					<div className='w-1/3 bg-white' />
					<div className='w-1/3 bg-primary-800' />
				</div>
			</div>

			<span className='text-xxs lg:text-sm font-light mr-1'>NG</span>

			{/* <HiChevronDown className='text-sm lg:text-base' /> */}
		</div>
	);
};

export default CountrySelector2;
