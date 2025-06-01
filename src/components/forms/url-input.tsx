"use client";

import React, { useState } from "react";

import { Loader2 } from "lucide-react";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url-input" className="text-sm font-medium">
          Website URL
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              className={`transition-colors ${
                isValid === false ? "border-red-500 focus:border-red-500" : 
                isValid === true ? "border-green-500 focus:border-green-500" : ""
              }`}
              disabled={isValidating}
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!isValid || isValidating}
            className="min-w-[100px]"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
