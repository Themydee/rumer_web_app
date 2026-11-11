import AppLayout from "@/components/AppLayout";
import React from "react";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
	return (
		<div className='h-[80vh] lg:h-screen grid place-items-center'>
			<div className='flex flex-col justify-center items-center'>
				<TbError404 className='animate-bounce text-primary-100 text-4xl' />
				<h3 className='text-base font-semibold text-primary-100'>
					Page not found Rumer
				</h3>
			</div>
		</div>
	);
};

export default NotFound;
