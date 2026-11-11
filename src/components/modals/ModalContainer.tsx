"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { MouseEventHandler, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAppDispatch } from "../hooks";

export interface ModalContainerProps extends React.PropsWithChildren {
	open: boolean;
	onClose: (val: boolean) => void;
	size?: "sm" | "md" | "md2" | "lg" | "xs";
	showCancelButton?: boolean;
	handleClose?: MouseEventHandler<SVGElement> | undefined;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
	open = false,
	onClose,
	size,
	showCancelButton = true,
	handleClose,
	children,
}) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<Transition appear show={open} as={React.Fragment}>
			<Dialog
				as='div'
				className='relative z-[9999]'
				onClose={() => onClose(false)}
			>
				<Transition.Child
					as={React.Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/60 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={React.Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel
								className={`${
									size === "sm"
										? "sm:w-[23rem] lg:w-[35vw]"
										: "w-[20rem] sm:w-[23rem] lg:w-[70vw]"
								}   
				${size === "lg" ? "h-[70vh] w-full overflow-y-auto" : ""}
				overflow-hidden rounded-xl bg-white shadow-2xl transition-all no-scrollbar`}
							>
								<div className='relative'>
									{showCancelButton && (
										<IoIosCloseCircle
											size={20}
											className='text-gray-200 hover:text-gray-600 transition hover:scale-125 cursor-pointer absolute top-0.5 md:top-1.5 right-3'
											onClick={handleClose}
										/>
									)}
									{children}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default ModalContainer;
