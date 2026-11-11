import React from "react";
import { BsExclamationLg } from "react-icons/bs";

interface LogoutModalProps {
	onClose: () => void;
	onLogout: () => void;
}
 

const LogoutModal = ({ onClose, onLogout }: LogoutModalProps) => {
	return (
		<div className='py-6 px-5 text-center'>
			<div className='flex justify-center mb-4'>
				<div className='bg-bg-900 rounded-full grid place-items-center size-20'>
					<BsExclamationLg className='text-yellow-500 text-5xl' />
				</div>
			</div>
			<h3 className='text-xl font-bold text-white leading-9'>
				Are You sure you want to Logout?
			</h3>
			<p className='text-sm text-bg-700/60 mt-2'>
				You&apos;ll need to sign in again to access your courses and materials.
			</p>
			<div className='flex justify-center lg:grid grid-cols-2 gap-4 mt-6'>
				<button
					onClick={onClose}
					className='px-6 py-2 text-sm border border-gray-600 text-white rounded-md hover:bg-gray-800 transition'
				>
					No, Cancel
				</button>
				<button
					onClick={onLogout}
					className='px-6 py-2 text-sm bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition'
				>
					Yes, Logout
				</button>
			</div>
		</div>
	);
};

export default LogoutModal;
