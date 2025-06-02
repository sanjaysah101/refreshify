"use client";

import { useState } from "react";

import { Check, Copy, Download, ExternalLink, RefreshCw, Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { TransformedData } from "../../lib/types";
import { ShinyText } from "../ui/shiny-text";

/* eslint-disable no-console */

interface ExportControlsProps {
  transformedData: TransformedData;
  shareUrl: string;
  onNewShareUrl: (_data: TransformedData) => Promise<void>;
}

export const ExportControls = ({ transformedData, shareUrl, onNewShareUrl }: ExportControlsProps) => {
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownloadHTML = () => {
    if (!transformedData) return;

    const blob = new Blob([transformedData.transformedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transformed-website-${transformedData.theme}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSS = () => {
    if (!transformedData) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(transformedData.transformedHtml, "text/html");
    const styleElement = doc.querySelector("style");
    const css = styleElement?.textContent || "";

    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transformed-styles-${transformedData.theme}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLivePreview = () => {
    if (!transformedData) return;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(transformedData.transformedHtml);
      newWindow.document.close();
    }
  };

  const handleRegenerateShareUrl = async () => {
    if (!transformedData) return;

    setIsGeneratingUrl(true);
    try {
      await onNewShareUrl(transformedData);
    } catch (error) {
      console.error("Failed to regenerate share URL:", error);
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleOpenShareUrl = () => {
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  if (!transformedData) {
    return (
      <Card className="p-4 opacity-50">
        <div className="text-center text-gray-300">
          <Download className="mx-auto mb-2 h-8 w-8" />
          <p className="text-sm">Transform a website to enable export options</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Download Options */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-medium">
          <Download className="h-4 w-4" />
          Download Files
        </h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button size="sm" onClick={handleDownloadHTML} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            HTML File
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadCSS} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            CSS File
          </Button>
          <Button variant="outline" size="sm" onClick={handleLivePreview} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Live Preview
          </Button>
        </div>
      </div>

      {/* Share URL Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-medium">
            <Share className="h-4 w-4" />
            Share URL
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateShareUrl}
            disabled={isGeneratingUrl}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGeneratingUrl ? "animate-spin" : ""}`} />
            {isGeneratingUrl ? "Generating..." : "New URL"}
          </Button>
        </div>

        {shareUrl ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1 border-[#167252] font-mono text-sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex min-w-[80px] items-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenShareUrl} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
            <p className="text-xs text-gray-300">Share this URL to let others view your transformed website</p>
          </div>
        ) : (
          <p className="text-sm text-gray-300">Share URL will be generated automatically</p>
        )}
      </div>

      {/* Theme Badge */}
      <div className="flex items-center justify-between border-0 border-t border-gray-700 pt-4">
        <span className="text-sm text-gray-300">Applied Theme:</span>
        <ShinyText
          text={transformedData.theme}
          className="cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] px-3 py-0.5 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
        />
      </div>
    </div>
  );
};
