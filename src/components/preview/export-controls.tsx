"use client";

import { useState } from "react";

import { Check, Copy, Download, ExternalLink, Share } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExportControlsProps {
  transformedData?: {
    html: string;
    theme: string;
    transformedAt: string;
  };
  originalUrl?: string;
}

export const ExportControls = ({ transformedData, originalUrl }: ExportControlsProps) => {
  const [shareUrl, setShareUrl] = useState<string>("");
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

    // Extract CSS from the HTML
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

  const handleGenerateShareUrl = async () => {
    if (!transformedData) return;

    setIsGeneratingUrl(true);
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: transformedData.html,
          theme: transformedData.theme,
          originalUrl: originalUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShareUrl(data.previewUrl);
      }
    } catch (error) {
      console.error("Failed to generate share URL:", error);
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
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Export & Share Options</h3>
          <Badge variant="outline">{transformedData.theme} theme</Badge>
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            HTML
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadCSS} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            CSS
          </Button>

          <Button variant="outline" size="sm" onClick={handleLivePreview} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Preview
          </Button>
        </div>

        {/* Shareable URL Section */}
        <div className="border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Share className="h-4 w-4" />
            <Label className="text-sm font-medium">Shareable Link</Label>
          </div>

          {!shareUrl ? (
            <Button onClick={handleGenerateShareUrl} disabled={isGeneratingUrl} className="w-full" variant="default">
              {isGeneratingUrl ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Share className="mr-2 h-4 w-4" />
                  Generate Shareable URL
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 text-sm"
                  placeholder="Shareable URL will appear here"
                />
                <Button size="sm" variant="outline" onClick={handleCopyUrl} className="flex items-center gap-1">
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <Button size="sm" variant="default" onClick={handleOpenShareUrl} className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Shareable Preview
              </Button>

              <p className="text-muted-foreground text-xs">
                💡 Share this URL with others to showcase your transformed website
              </p>
            </div>
          )}
        </div>

        <div className="text-muted-foreground border-t pt-3 text-xs">
          <p>Original: {originalUrl}</p>
          <p>Transformed: {new Date(transformedData.transformedAt).toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
};
