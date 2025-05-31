"use client";

import { useState } from "react";

import { Download, ExternalLink, Monitor, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <Badge variant={type === "original" ? "secondary" : "default"}>
            {type === "original" ? "Original" : "Transformed"}
          </Badge>
          {type === "transformed" && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("desktop")}
                className={viewMode === "desktop" ? "bg-muted" : ""}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("mobile")}
                className={viewMode === "mobile" ? "bg-muted" : ""}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`bg-muted mb-3 overflow-hidden rounded-lg ${
          viewMode === "mobile" ? "mx-auto aspect-[9/16] max-w-sm" : "aspect-video"
        }`}
      >
        {screenshot ? (
          <img src={screenshot} alt={`${type} website preview`} className="h-full w-full object-cover" />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            No preview available
          </div>
        )}
      </div>

      {metadata && (
        <div className="mb-3 space-y-1">
          <h4 className="text-sm font-medium">{metadata.title}</h4>
          <p className="text-muted-foreground line-clamp-2 text-xs">{metadata.description}</p>
        </div>
      )}

      {type === "transformed" && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onOpenPreview} className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      )}
    </Card>
  );
};
