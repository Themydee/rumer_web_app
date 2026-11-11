import React from "react";

const CopyRight = () => {
	const currentYear = new Date().getFullYear();
	return (
		<h5 className='text-center md:text-left text-xs sm:text-sm text-gray-400 order-2 md:order-1'>
			© {currentYear} Rummer. All rights reserved.
		</h5>
	);
};

export default CopyRight;
