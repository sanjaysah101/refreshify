"use client";

import React, { useEffect, useState } from "react";

import { Variants, motion } from "framer-motion";
import { Globe, Loader2, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { worksWithSites } from "../../lib/constants";
import { Button } from "../ui/button";
import { CardSpotlight } from "../ui/card-spotlight";
import { ShinyText } from "../ui/shiny-text";

interface UrlInputProps {
  onDataScraped?: (data: any) => void;
  onAnalyzeStart?: () => void;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const UrlInput = ({ onDataScraped, onAnalyzeStart, url, setUrl }: UrlInputProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (url) {
      const valid = validateUrl(url);
      setIsValid(valid);
      if (!valid) {
        setError("Please enter a valid URL (e.g., https://example.com)");
      }
    }
  }, [url]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(null);

    if (newUrl) {
      const valid = validateUrl(newUrl);
      setIsValid(valid);
      if (!valid) {
        setError("Please enter a valid URL (e.g., https://example.com)");
      }
    } else {
      setIsValid(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid && !isValidating) {
      handleAnalyze();
    }
  };

  const handleAnalyze = async () => {
    if (!url || !isValid) return;

    setIsValidating(true);
    setError(null);

    // Reset app state when starting new analysis
    onAnalyzeStart?.();

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (result.success) {
        onDataScraped?.(result.data);
      } else {
        setError(result.error || "Failed to analyze website");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };
  const contentDelay = 0.3;

  const bannerVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: contentDelay } },
  };

  return (
    <>
      <CardSpotlight className="flex flex-col gap-3 rounded-2xl bg-transparent">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="z-10 mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
        >
          Transform Any Website
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="z-10 mx-auto text-xl text-gray-300"
        >
          Enter a URL to analyze and transform with modern AI-powered themes
        </motion.p>
        <Label htmlFor="url-input" className="z-10 mt-3 flex items-center gap-2 text-sm font-semibold">
          <Globe className="h-4 w-4 text-blue-600" />
          Website URL
          <ShinyText
            text="Enter any website"
            className="cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] px-4 py-1 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
          />
        </Label>
        <div className="space-y-3">
          <div className="group relative">
            <div className="relative flex gap-3">
              <div className="relative flex-1">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={handleUrlChange}
                  onKeyDown={handleKeyPress}
                  disabled={isValidating}
                />
                {isValid === true && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  </div>
                )}
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!isValid || isValidating}
                className="hover:bg-opacity-90 w-full flex-shrink-0 rounded-md bg-[#0CF2A0] px-5 py-2 text-sm font-semibold whitespace-nowrap text-[#111111] shadow-sm transition-colors duration-200 hover:shadow-md sm:w-auto"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
          {error && (
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-red-500 opacity-10 blur" />
              <div className="relative rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-red-700">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  {error}
                </p>
              </div>
            </div>
          )}
          {isValid === true && !error && (
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-green-500 opacity-10 blur" />
              <div className="relative rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Valid URL - Ready to analyze!
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Quick Examples */}
        <div className="pt-4">
          <p className="mb-3 text-xs font-medium text-slate-500">Try these examples:</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-400">
            {worksWithSites.map((exampleUrl) => (
              <motion.div
                variants={bannerVariants}
                initial="hidden"
                animate="visible"
                key={exampleUrl}
                onClick={() => setUrl(exampleUrl)}
                className="flex items-center whitespace-nowrap"
              >
                <ShinyText
                  text={exampleUrl.replace("https://", "")}
                  className="cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] px-4 py-1 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </CardSpotlight>
    </>
  );
};
