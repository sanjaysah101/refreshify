"use client";

import React, { useState } from "react";

import { Globe, Loader2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  onDataScraped?: (data: any) => void;
  onAnalyzeStart?: () => void;
}

export const UrlInput = ({ onDataScraped, onAnalyzeStart }: UrlInputProps) => {
  const [url, setUrl] = useState("");
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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="url-input" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Globe className="h-4 w-4 text-blue-600" />
          Website URL
          <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-xs text-blue-700">
            Enter any website
          </Badge>
        </Label>
        <div className="group relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur transition duration-300 group-hover:opacity-30" />
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={handleUrlChange}
                onKeyPress={handleKeyPress}
                className={`relative h-12 border-2 bg-white/80 pr-4 pl-4 text-base backdrop-blur-sm transition-all duration-200 ${
                  isValid === false
                    ? "border-red-400 bg-red-50/50 focus:border-red-500"
                    : isValid === true
                      ? "border-green-400 bg-green-50/50 focus:border-green-500"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                } shadow-sm hover:shadow-md focus:shadow-lg`}
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
              className={`h-12 px-8 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl ${
                isValidating
                  ? "bg-gradient-to-r from-blue-400 to-purple-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
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
              <p className="text-sm font-medium text-red-700">{error}</p>
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
      <div className="border-t border-slate-200/50 pt-4">
        <p className="mb-3 text-xs font-medium text-slate-500">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {["https://github.com", "https://stripe.com", "https://vercel.com"].map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => {
                setUrl(exampleUrl);
                setIsValid(true);
                setError(null);
              }}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-200"
              disabled={isValidating}
            >
              {exampleUrl.replace("https://", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
