"use client";
import React, { Fragment, useState, useEffect, useRef } from "react";

import { FaCaretDown, FaSortDown } from "react-icons/fa";

import { PiBell, PiBellFill, PiFlagPennantFill } from "react-icons/pi";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { CgLogOut } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import Link from "next/link";
import { FiBell } from "react-icons/fi";
import {
  BiCheck,
  BiChevronDown,
  BiCog,
  BiLogOut,
  BiUser,
} from "react-icons/bi";
import HamburgerMenu from "react-hamburger-menu";
import { gsap } from "gsap";
import { useQuery } from "react-query";
import { RummerLogo } from "@/components/utils/functions";
import { useAppDispatch, useAppSelector } from "@/components/hooks";
import { signOut } from "@/components/utils/data";
import MobileNavB from "@/components/global-b/MobileNavB";
import { PRODUCTS_SUBMENU } from "./DashboardSideNav";
import NotificationBell from "@/components/reusables/NotificationBell";
import SearchInput from "@/components/reusables/SearchInput";
import SearchInput2 from "@/components/reusables/SearchInput2";

const DashboardHeader = () => {
  const [sidebar, setSidebar] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const headerRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();

  // GSAP animations for header entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header slide down animation
      gsap.fromTo(
        headerRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // Stagger animation for header elements
      gsap.fromTo(
        ".header-element",
        {
          y: -20,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );

      // Special animation for user avatar
      gsap.fromTo(
        ".user-avatar",
        {
          scale: 0,
          rotation: -180,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          delay: 0.6,
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Animation for menu dropdowns
  const animateDropdown = (element: HTMLElement, isOpening: boolean) => {
    if (isOpening) {
      gsap.fromTo(
        element,
        {
          scale: 0.8,
          opacity: 0,
          y: -10,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        }
      );

      // Animate dropdown items with stagger
      const items = element.querySelectorAll(".dropdown-item");
      gsap.fromTo(
        items,
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.25,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    } else {
      gsap.to(element, {
        scale: 0.8,
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  };

  // Hover animations for interactive elements
  const handleButtonHover = (element: HTMLElement, isHovering: boolean) => {
    if (isHovering) {
      gsap.to(element, {
        y: -2,
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(element.querySelector("svg"), {
        rotation: 5,
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(element, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(element.querySelector("svg"), {
        rotation: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  // Animation for notification bell
  const animateNotification = (element: HTMLElement) => {
    gsap.to(element, {
      rotation: 15,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  };

  // Animation for hamburger menu
  const animateHamburger = (isOpen: boolean) => {
    const hamburger = document.querySelector(".hamburger-menu");
    if (hamburger) {
      if (isOpen) {
        gsap.to(hamburger, {
          rotation: 90,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(hamburger, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  const isOverview = pathname === "/dashboard";

  const handleMenuToggle = () => {
    animateHamburger(!sidebar);
    setSidebar(!sidebar);
  };

  const userName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const defaultMenuItems = [
    {
      label: "Account settings",
      href: "/dashboard/account-settings",
    },
    {
      label: "Audit logs",
      href: "/dashboard/audit-logs",
    },
    {
      label: "Support",
      href: "/dashboard/support",
    },
    { divider: true },
    {
      label: "Log out",
      onClick: signOut,
    },
  ];

  const GoToMarketplace = () => (
    <button
      onClick={() => router.push("/marketplace")}
      className="header-element inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#014834] rounded-full text-sm font-medium text-white shadow-sm hover:bg-[#013824] focus:outline-none transition-all"
      title="Go to Marketplace"
      onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
      onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}>
      Go to Marketplace
    </button>
  );

  const AddBusiness = ({ count = 0 }: { count?: number }) => (
    <button
      className="header-element inline-flex items-center tracking-wider gap-1 px-3 py-3 bg-gray-300/50 rounded-full text-sm shadow-sm hover:shadow focus:outline-none transition-all"
      title="Business"
      onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
      onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}>
      <LuPlus className="text-black-100 transition-transform" />
      <span className="text-xs text-black-100">Add Business</span>
    </button>
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed z-50 w-full flex items-center lg:w-[82%] xl:w-[85%] px-3 sm:px-4 lg:px-6 py-2 lg:py-5 bg-white border-b border-slate-100 shadow-sm min-h-[80px] lg:min-h-[70px]">
        {/* Mobile */}
        <div className="flex w-full items-center justify-between lg:hidden">
          {/* Left area: mobile menu + logo (mobile), overview pill */}
          <div
            ref={mobileSectionRef}
            className="flex items-center gap-3 sm:gap-4">
            {/* @ts-ignore */}
            <HamburgerMenu
              // @ts-ignore
              className="hamburger-menu header-element"
              isOpen={sidebar}
              menuClicked={handleMenuToggle}
              width={20}
              height={15}
              strokeWidth={2}
              rotate={0}
              color="#374151"
              borderRadius={0}
              animationDuration={0.3}
            />

            {/* Logo */}
            <div className="header-element">
              <RummerLogo isGreen />
            </div>
          </div>

          <div ref={buttonsRef} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Mobile notification bell */}
              <div className="header-element">
                <NotificationBell variant="light" />
              </div>

              {/* Avatar & dropdown */}
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <Menu.Button
                      className="header-element flex items-center gap-1 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all hover:bg-slate-50 p-1 sm:px-2 sm:py-1"
                      onMouseEnter={(e) =>
                        handleButtonHover(e.currentTarget, true)
                      }
                      onMouseLeave={(e) =>
                        handleButtonHover(e.currentTarget, false)
                      }>
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={userName || "User"}
                          className="user-avatar w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover transition-transform"
                        />
                      ) : (
                        <div className="user-avatar w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-white grid place-items-center font-semibold text-xs sm:text-sm transition-transform">
                          {initials}
                        </div>
                      )}
                      <BiChevronDown
                        className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-500 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-1 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-1 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      // @ts-ignore
                      afterEnter={(el) =>
                        animateDropdown(el as HTMLElement, true)
                      }
                      // @ts-ignore
                      afterLeave={(el) =>
                        animateDropdown(el as HTMLElement, false)
                      }>
                      <Menu.Items className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right bg-white border border-slate-200 shadow-lg rounded-lg py-2 focus:outline-none z-50">
                        {/* User info header */}
                        {user?.email && (
                          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100">
                            {userName && (
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {userName}
                              </p>
                            )}
                            {user?.email && (
                              <p className="text-xs sm:text-sm text-slate-500 truncate mt-1">
                                {user.email}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="px-3 sm:px-4 py-3">
                          <AddBusiness />
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          {defaultMenuItems.map((item, index) => {
                            if (item.divider) {
                              return (
                                <div
                                  key={index}
                                  className="border-t border-slate-100 my-1"
                                />
                              );
                            }

                            const menuItemContent = (
                              <div
                                className={`dropdown-item flex items-center gap-3 px-3 sm:px-4 py-2 text-sm transition-all ${
                                  item.onClick
                                    ? "cursor-pointer hover:bg-slate-50"
                                    : ""
                                }`}>
                                <span className="text-slate-700 text-xs sm:text-sm">
                                  {item.label}
                                </span>
                              </div>
                            );

                            return (
                              <Menu.Item key={index}>
                                {({ active }) =>
                                  item.href ? (
                                    <Link
                                      href={item.href}
                                      className={`block ${
                                        active ? "bg-slate-50" : ""
                                      }`}>
                                      {menuItemContent}
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={item.onClick}
                                      className={`w-full text-left ${
                                        active ? "bg-slate-50" : ""
                                      }`}>
                                      {menuItemContent}
                                    </button>
                                  )
                                }
                              </Menu.Item>
                            );
                          })}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="w-full items-center justify-between hidden lg:flex">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="lg:hidden header-element">
                <RummerLogo isGreen className="" />
              </div>

              <div>
                <SearchInput2
                  placeholder="Search here..."
                  searchQuery=""
                  setSearchQuery={() => console.log("")}
                  className="!bg-secondary-300 !w-[500px]"
                />
              </div>
            </div>

            <div
              ref={desktopSectionRef}
              className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                <div className="hidden sm:block header-element">
                  <GoToMarketplace />
                </div>

                <div className="scale-90 sm:scale-100 header-element">
                  <NotificationBell variant="light" />
                </div>

                {/* Desktop dropdown menus with same animations */}
                <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <Menu.Button
                        className="header-element flex items-center gap-1 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all hover:bg-slate-50 p-1 sm:px-2 sm:py-1"
                        onMouseEnter={(e) =>
                          handleButtonHover(e.currentTarget, true)
                        }
                        onMouseLeave={(e) =>
                          handleButtonHover(e.currentTarget, false)
                        }>
                        <div className="user-avatar w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-white grid place-items-center font-semibold text-xs sm:text-sm transition-transform">
                          {initials}
                        </div>
                        <BiChevronDown
                          className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-500 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-1 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-1 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        // @ts-ignore
                        afterEnter={(el) =>
                          animateDropdown(el as HTMLElement, true)
                        }
                        // @ts-ignore
                        afterLeave={(el) =>
                          animateDropdown(el as HTMLElement, false)
                        }>
                        <Menu.Items className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right bg-white border border-slate-200 shadow-lg rounded-lg py-2 focus:outline-none z-50">
                          {user?.email && (
                            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100">
                              {userName && (
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {userName}
                                </p>
                              )}
                              {user?.email && (
                                <p className="text-xs sm:text-sm text-slate-500 truncate mt-1">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="px-3 sm:px-4 py-3">
                            <AddBusiness />
                          </div>

                          <div className="py-1">
                            {defaultMenuItems.map((item, index) => {
                              if (item.divider) {
                                return (
                                  <div
                                    key={index}
                                    className="border-t border-slate-100 my-1"
                                  />
                                );
                              }

                              const menuItemContent = (
                                <div
                                  className={`dropdown-item flex items-center gap-3 px-3 sm:px-4 py-2 text-sm transition-all ${
                                    item.onClick
                                      ? "cursor-pointer hover:bg-slate-50"
                                      : ""
                                  }`}>
                                  <span className="text-slate-700 text-xs sm:text-sm">
                                    {item.label}
                                  </span>
                                </div>
                              );

                              return (
                                <Menu.Item key={index}>
                                  {({ active }) =>
                                    item.href ? (
                                      <Link
                                        href={item.href}
                                        className={`block ${
                                          active ? "bg-slate-50" : ""
                                        }`}>
                                        {menuItemContent}
                                      </Link>
                                    ) : (
                                      <button
                                        onClick={item.onClick}
                                        className={`w-full text-left ${
                                          active ? "bg-slate-50" : ""
                                        }`}>
                                        {menuItemContent}
                                      </button>
                                    )
                                  }
                                </Menu.Item>
                              );
                            })}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>

			<MobileNavB
				isOpen={sidebar}
				onClose={() => setSidebar(false)}
				navItems={[
					{ label: "Home", href: "/dashboard" },
					{ label: "Manage Products", href: "/dashboard/products", submenu: PRODUCTS_SUBMENU.map(({ label, href }) => ({ label, href })) },
					{ label: "Wallet", href: "/dashboard/wallet" },
					{ label: "Orders", href: "/dashboard/orders" },
					{ label: "Settings", href: "/dashboard/settings" },
				]}
			/>
    </>
  );
};

export default DashboardHeader;
2;
