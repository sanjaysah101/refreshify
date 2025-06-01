"use client";

import { useState } from "react";

import { Check, Copy, Download, ExternalLink, RefreshCw, Share } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ExportControlsProps {
  transformedData?: {
    html: string;
    theme: string;
    transformedAt: string;
  };
  originalUrl?: string;
  shareUrl?: string;
  onNewShareUrl?: (data: any) => Promise<void>;
}

export const ExportControls = ({ transformedData, originalUrl, shareUrl, onNewShareUrl }: ExportControlsProps) => {
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownloadHTML = () => {
    if (!transformedData) return;

    const blob = new Blob([transformedData.html], { type: "text/html" });
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
    const doc = parser.parseFromString(transformedData.html, "text/html");
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
      newWindow.document.write(transformedData.html);
      newWindow.document.close();
    }
  };

  const handleRegenerateShareUrl = async () => {
    if (!transformedData || !onNewShareUrl) return;

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
        <div className="text-muted-foreground text-center">
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
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Files
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="flex items-center gap-2">
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
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium flex items-center gap-2">
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
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center gap-2 min-w-[80px]"
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenShareUrl}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this URL to let others view your transformed website
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Share URL will be generated automatically
          </p>
        )}
      </div>

      {/* Theme Badge */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-muted-foreground">Applied Theme:</span>
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
          {transformedData.theme}
        </Badge>
      </div>
    </div>
  );
};
