"use client";

import React, { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  onDataScraped?: (data: any) => void;
}

export const UrlInput = ({ onDataScraped }: UrlInputProps) => {
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
      setIsValid(validateUrl(newUrl));
    } else {
      setIsValid(null);
    }
  };

  const handleScrapeWebsite = async () => {
    if (!url || !isValid) return;

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Error scraping website:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="url-input">Website URL</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={handleUrlChange}
            className={`${isValid === false ? "border-destructive" : isValid === true ? "border-green-500" : ""}`}
          />
          {isValid === false && <p className="text-destructive mt-1 text-sm">Please enter a valid URL</p>}
          {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
        </div>
        <Button variant="outline" onClick={handleScrapeWebsite} disabled={!isValid || isValidating}>
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
    </div>
  );
};
