"use client";

import { motion } from "framer-motion";

import { ShinyText } from "./ui/shiny-text";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative mt-20 border-t border-white/20 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.div
            className="flex flex-shrink-0 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#0CF2A0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-white">Refreshify</span>
          </motion.div>
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              AI-Powered Website Transformation
            </motion.p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <span>Built with</span>
            <span className="text-red-500">❤️</span>
            <span>using Next.js, Tailwind CSS, and AI</span>
          </div>
          <div className="mt-4 text-sm text-gray-300">
            <span>© 2023 Refreshify. All rights reserved.</span>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {["Next.Js 15", "Tailwind CSS v4", "AI Powered"].map((feature) => (
              <ShinyText
                key={feature}
                text={feature}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-700 bg-[#1a1a1a] px-4 py-1 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
