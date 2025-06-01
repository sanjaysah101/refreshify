"use client";

import { useState } from "react";

import { Download, ExternalLink, Monitor, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WebsitePreviewProps {
  title: string;
  screenshot?: string;
  type: "original" | "transformed";
  metadata?: {
    title: string;
    description: string;
  };
  transformedHtml?: string;
  onDownload?: () => void;
  onOpenPreview?: () => void;
}

export const WebsitePreview = ({
  title,
  screenshot,
  type,
  metadata,
  transformedHtml,
  onDownload,
  onOpenPreview,
}: WebsitePreviewProps) => {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={type === "original" ? "secondary" : "default"} className="capitalize">
            {type}
          </Badge>
          {type === "transformed" && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("desktop")}
                className={`h-8 w-8 p-0 ${viewMode === "desktop" ? "bg-muted" : ""}`}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("mobile")}
                className={`h-8 w-8 p-0 ${viewMode === "mobile" ? "bg-muted" : ""}`}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={`bg-muted border-muted-foreground/20 overflow-hidden rounded-lg border-2 border-dashed ${
          viewMode === "mobile" ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"
        }`}
      >
        {screenshot && !imageError ? (
          <img
            src={screenshot}
            alt={`${type} website preview`}
            className="h-full w-full object-cover object-top"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <div className="text-muted-foreground text-center">
              <Monitor className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm font-medium">Preview Unavailable</p>
              <p className="text-xs">Screenshot could not be generated</p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="space-y-2">
          <h4 className="line-clamp-1 text-sm font-medium">{metadata.title}</h4>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{metadata.description}</p>
        </div>
      )}

      {/* Action Buttons */}
      {type === "transformed" && (onOpenPreview || onDownload) && (
        <div className="flex gap-2 border-t pt-2">
          {onOpenPreview && (
            <Button variant="outline" size="sm" onClick={onOpenPreview} className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
