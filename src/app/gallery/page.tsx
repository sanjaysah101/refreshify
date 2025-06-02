"use client";
import { Compare } from "@/components/ui/compare";
import { useEffect, useState } from "react";
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
      <h1>Transformed Websites Gallery</h1>
      <div className="flex gap-4 flex-wrap">
        {previews.map((preview) => (
          <div
          role="presentation"
            key={preview.previewId}
            className="border border-white p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleCardClick(preview.previewId)}
          >
            <div><strong>Original URL:</strong> {preview.originalUrl}</div>
            <div><strong>Theme:</strong> {preview.theme}</div>
            <div><strong>Created:</strong> {new Date(preview.createdAt).toLocaleString()}</div>
            <Compare
              firstImage={preview?.originalScreenshot}
              secondImage={preview?.transformedScreenshot}
              className="my-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}