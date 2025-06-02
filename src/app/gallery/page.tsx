"use client";

import { useEffect, useState } from "react";

import { Compare } from "@/components/ui/compare";

import { PreviewData } from "../../generated/prisma";

export default function GalleryPage() {
  const [previews, setPreviews] = useState<PreviewData[]>([]);

  useEffect(() => {
    async function fetchPreviews() {
      const res = await fetch("/api/previews");
      if (res.ok) {
        const data = await res.json();
        setPreviews(data);
      }
    }
    fetchPreviews();
  }, []);

  const handleCardClick = (previewId: string) => {
    window.open(`/api/preview/${previewId}`, "_blank");
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-xl">Transformed Websites Gallery</h1>
      <div className="flex flex-wrap gap-4">
        {previews.map((preview) => (
          <div
            role="presentation"
            key={preview.previewId}
            className="cursor-pointer rounded-lg border border-white p-4 shadow-md"
            onClick={() => handleCardClick(preview.previewId)}
          >
            <div>
              <strong>Original URL:</strong> {preview.url}
            </div>
            <div>
              <strong>Theme:</strong> {preview.theme}
            </div>
            <div>
              <strong>Created:</strong> {new Date(preview.createdAt).toLocaleString()}
            </div>
            <Compare secondImage={preview.screenshot} firstImage={preview.transformedScreenshot} className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
