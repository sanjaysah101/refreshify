"use client";

import Image from "next/image";
import React, { type MouseEvent as ReactMouseEvent, type ReactNode, type SVGProps, useState } from "react";

import { AnimatePresence, Variants, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const ChevronDownIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="ml-1 inline-block h-3 w-3 transition-transform duration-200 group-hover:rotate-180"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const MenuIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

interface NavLinkProps {
  href?: string;
  children: ReactNode;
  hasDropdown?: boolean;
  className?: string;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href = "#", children, hasDropdown = false, className = "", onClick }) => (
  <motion.a
    href={href}
    onClick={onClick}
    className={cn(
      "group relative flex items-center py-1 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white",
      className
    )}
    whileHover="hover"
  >
    {children}
    {hasDropdown && <ChevronDownIcon />}
    {!hasDropdown && (
      <motion.div
        className="absolute right-0 bottom-[-2px] left-0 h-[1px] bg-[#0CF2A0]"
        variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
        initial="initial"
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    )}
  </motion.a>
);

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const headerVariants: Variants = {
    top: {
      backgroundColor: "rgba(17, 17, 17, 0.8)",
      borderBottomColor: "rgba(55, 65, 81, 0.5)",
      position: "fixed",
      boxShadow: "none",
    },
    scrolled: {
      backgroundColor: "rgba(17, 17, 17, 0.95)",
      borderBottomColor: "rgba(75, 85, 99, 0.7)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      position: "fixed",
    },
  };

  const mobileMenuVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-30 w-full border-b px-6 backdrop-blur-md md:px-10 lg:px-16"
    >
      <nav className="mx-auto flex h-[70px] max-w-screen-xl items-center justify-between">
        <NavLink href="/" className="flex flex-shrink-0 items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#0CF2A0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 17L12 22L22 17" stroke="#0CF2A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#0CF2A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ml-2 text-xl font-bold text-white">Refreshify</span>
        </NavLink>

        <div className="hidden flex-grow items-center justify-center space-x-6 px-4 md:flex lg:space-x-8">
          <NavLink href="#">Product</NavLink>
          <NavLink href="#">Customers</NavLink>
        </div>

        <div className="flex flex-shrink-0 items-center space-x-4 lg:space-x-6">
          <Tooltip>
            <TooltipTrigger>
              <NavLink href="https://github.com/sanjaysah101/refreshify" className="hidden md:inline-block">
                <Image src="/github-mark-white.svg" alt="Github Icon" width={24} height={24} />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>See code in Github</p>
            </TooltipContent>
          </Tooltip>

          <motion.a
            href="/examples"
            className="hover:bg-opacity-90 rounded-md bg-[#0CF2A0] px-4 py-[6px] text-sm font-semibold whitespace-nowrap text-[#111111] shadow-sm transition-colors duration-200 hover:shadow-md"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            View Example
          </motion.a>

          <motion.button
            className="z-50 text-gray-300 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 left-0 border-t border-gray-800/50 bg-[#111111]/95 py-4 shadow-lg backdrop-blur-sm md:hidden"
          >
            <div className="flex flex-col items-center space-y-4 px-6">
              <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>
                Product
              </NavLink>
              <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>
                Customers
              </NavLink>
              <hr className="my-2 w-full border-t border-gray-700/50" />
              <NavLink href="/examples" onClick={() => setIsMobileMenuOpen(false)}>
                View Example
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
