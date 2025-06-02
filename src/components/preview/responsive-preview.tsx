"use client";

import { useState } from "react";

import { Monitor, Smartphone, Tablet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* eslint-disable @next/next/no-img-element */

interface ResponsivePreviewProps {
  title: string;
  screenshot?: string;
  type: "original" | "transformed";
  metadata?: {
    title: string;
    description: string;
  };
  html?: string;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes = {
  desktop: { width: "100%", height: "600px", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", height: "600px", icon: Tablet, label: "Tablet" },
  mobile: {
    width: "375px",
    height: "600px",
    icon: Smartphone,
    label: "Mobile",
  },
};

export const ResponsivePreview = ({ title, screenshot, type, metadata, html }: ResponsivePreviewProps) => {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [showLive, setShowLive] = useState(false);

  const currentViewport = viewportSizes[viewport];

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <Badge variant={type === "original" ? "secondary" : "default"}>
            {type === "original" ? "Original" : "Transformed"}
          </Badge>
        </div>

        {/* Viewport Controls */}
        {html && (
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-1">
              {Object.entries(viewportSizes).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={key}
                    variant={viewport === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewport(key as ViewportSize)}
                    className="flex items-center gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{config.label}</span>
                  </Button>
                );
              })}
            </div>

            <Button variant={showLive ? "default" : "default"} size="sm" onClick={() => setShowLive(!showLive)}>
              {showLive ? "Screenshot" : "Live Preview"}
            </Button>
          </div>
        )}

        {/* Preview Area */}
        <div className="bg-muted overflow-hidden rounded-lg" style={{ height: "600px" }}>
          {html && showLive ? (
            <div className="flex h-full justify-center">
              <div
                className="overflow-auto border-x border-gray-300"
                style={{
                  width: currentViewport.width,
                  maxWidth: "100%",
                  height: "100%",
                }}
              >
                <iframe srcDoc={html} className="h-full w-full border-0" title={`${title} - ${viewport} preview`} />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt={`${type} website preview`}
                  className="max-h-full max-w-full object-contain"
                  style={{
                    width: viewport !== "desktop" ? currentViewport.width : "auto",
                    maxWidth: "100%",
                  }}
                />
              ) : (
                <div className="text-muted-foreground text-center">
                  <Monitor className="mx-auto mb-2 h-12 w-12" />
                  <p>No preview available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        {metadata && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">{metadata.title}</h4>
            <p className="text-muted-foreground line-clamp-2 text-xs">{metadata.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
