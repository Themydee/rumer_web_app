"use client";
import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { BsChevronDown } from "react-icons/bs";

const CountrySelector = () => {
	const [selected, setSelected] = useState("NG");

	return (
		<div className='relative'>
			<ReactFlagsSelect
				selected={selected}
				onSelect={(code) => setSelected(code)}
				countries={["NG"]}
				customLabels={{ NG: "NG" }}
				placeholder='NG'
				className='country-selector'
				selectButtonClassName='flex items-center gap-1 !px-1 py-3 !text-sm !bg-black-100 !rounded-xl !text-white border border-gray-250 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500'
			/>

			{/* Custom dropdown icon */}
			<div className='absolute right-1.5 top-[45%] transform -translate-y-1/2 pointer-events-none bg-black-100'>
				<BsChevronDown />
			</div>
		</div>
	);
};

export default CountrySelector;
