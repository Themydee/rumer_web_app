"use client";
import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Transition } from "@headlessui/react";
import {
	FiUser,
	FiShoppingCart,
	FiBell,
	FiCreditCard,
	FiKey,
	FiLogOut,
	FiTrash,
} from "react-icons/fi";
import Link from "next/link";
import { Modal, ModalContent, useDisclosure } from "@heroui/react";
import { BsExclamationLg } from "react-icons/bs";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import LogoutModal from "../modals/LogoutModal";
import { useRouter } from "next/navigation";
import { authLogout } from "../Redux/auth";
import { useAppDispatch } from "../hooks";

type MenuItem =
	| {
			label: string;
			icon: JSX.Element;
			href: string;
			danger?: boolean;
	  }
	| {
			label: string;
			icon: JSX.Element;
			onClick: () => void;
			danger?: boolean;
	  };

interface MenuProps {
	isOpen: boolean;
	onClose: () => void;
}
const UserMenu = ({ isOpen, onClose }: MenuProps) => {
	const router = useRouter();
	const menuRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	const {
		isOpen: isOpenDeleteModal,
		onOpen: onOpenDeleteModal,
		onOpenChange: onOpenChangeDeleteModal,
		onClose: onCloseDeleteModal,
	} = useDisclosure();

	const {
		isOpen: isOpenLogoutModal,
		onOpen: onOpenLogoutModal,
		onOpenChange: onOpenChangeLogoutModal,
		onClose: onCloseLogoutModal,
	} = useDisclosure();

	const menuItems: MenuItem[] = [
		{ label: "Profile", icon: <FiUser />, href: "/profile" },
		{ label: "Subscription", icon: <FiShoppingCart />, href: "/pricing" },
		{ label: "Notifications", icon: <FiBell />, href: "/notifications" },
		{
			label: "Payment Method",
			icon: <FiCreditCard />,
			href: "/payment-method",
		},
		{ label: "Security", icon: <FiKey />, href: "/security" },
		{ label: "Sign out", icon: <FiLogOut />, onClick: onOpenLogoutModal },
		{
			label: "Delete account",
			icon: <FiTrash />,
			danger: true,
			onClick: onOpenDeleteModal,
		},
	];

	const handleLogout = () => {
		Cookies.remove("token");
		Cookies.remove("refreshToken");
		if (typeof window !== "undefined") {
			localStorage.removeItem("rumer_auth_token");
		}
		dispatch(authLogout());
		router.push("/login");
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	return (
		<>
			<Transition
				show={isOpen}
				enter='transition ease-out duration-200'
				enterFrom='opacity-0 -translate-y-2'
				enterTo='opacity-100 translate-y-0'
				leave='transition ease-in duration-150'
				leaveFrom='opacity-100 translate-y-0'
				leaveTo='opacity-0 -translate-y-2'
			>
				<div
					ref={menuRef}
					className='absolute right-4 top-10 w-52 lg:w-72 bg-bg-100 rounded-xl py-2 lg:py-4 shadow-lg border border-gray-100/20 z-50'
				>
					<ul className='space-y-1 lg:space-y-3'>
						{menuItems.map((item, index) => (
							<div key={item.label}>
								<li className='lg:pl-2 pr-3'>
									{"href" in item ? (
										<Link
											href={item.href}
											className={`flex items-center gap-3 lg:gap-5 px-4 py-2 rounded-md transition ${
												item.danger
													? "text-red-500 hover:bg-red-500/10"
													: "text-white hover:bg-zinc-800"
											}`}
										>
											<span className='text-base lg:text-xl font-medium'>
												{item.icon}
											</span>
											<span className='text-sm font-light'>{item.label}</span>
										</Link>
									) : (
										<button
											onClick={item.onClick}
											className={`w-full text-left flex items-center gap-3 lg:gap-5 px-4 py-2 rounded-md transition ${
												item.danger
													? "text-red-500 hover:bg-red-500/10"
													: "text-white hover:bg-zinc-800"
											}`}
										>
											<span className='text-base lg:text-xl font-medium'>
												{item.icon}
											</span>
											<span className='text-sm font-light'>{item.label}</span>
										</button>
									)}
								</li>

								{(index === 2 || index === 4) && (
									<hr className='my-1 sm:my-2 border-gray-100/10' />
								)}
							</div>
						))}
					</ul>
				</div>
			</Transition>

			{/* Delete Account Modal */}
			<Modal
				isOpen={isOpenDeleteModal}
				onOpenChange={onOpenChangeDeleteModal}
				backdrop='blur'
				size='md'
				shadow='md'
			>
				<ModalContent className='p-0 bg-black-100'>
					<DeleteAccountModal
						onClose={onCloseDeleteModal}
						onDelete={() => {}}
					/>
				</ModalContent>
			</Modal>

			{/* Log out Modal */}
			<Modal
				isOpen={isOpenLogoutModal}
				onOpenChange={onOpenChangeLogoutModal}
				backdrop='blur'
				size='md'
				shadow='lg'
			>
				<ModalContent className='p-0 bg-black-100'>
					<LogoutModal onClose={onCloseLogoutModal} onLogout={handleLogout} />
				</ModalContent>
			</Modal>
		</>
	);
};

export default UserMenu;
