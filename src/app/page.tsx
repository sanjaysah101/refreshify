"use client";

import { useState } from "react";

import { THEME_OPTIONS } from "@/components/forms/theme-selector";

import FeatureCards from "../components/feature-cards";
import InteractiveHero from "../components/hero-section-nexus";

interface ScrapedData {
  url: string;
  screenshot: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    language: string;
  };
  structure: any;
  styles: any;
  extractedAt: string;
}

type ProgressStatus = "pending" | "active" | "completed" | "error";
interface ProgressStep {
  id: string;
  label: string;
  status: ProgressStatus;
  description: string;
}

const initialProgressSteps: ProgressStep[] = [
  {
    id: "scrape",
    label: "Analyzing Website",
    status: "pending",
    description: "Extracting content and structure",
  },
  {
    id: "transform",
    label: "Applying Theme",
    status: "pending",
    description: "Generating modern design",
  },
  {
    id: "render",
    label: "Creating Preview",
    status: "pending",
    description: "Rendering final result",
  },
  {
    id: "complete",
    label: "Ready!",
    status: "pending",
    description: "Transformation complete",
  },
];

const HomePage = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>(THEME_OPTIONS[0].value);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedData, setTransformedData] = useState<any>(null);
  const [transformProgress, setTransformProgress] = useState(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>(initialProgressSteps);
  const [shareUrl, setShareUrl] = useState<string>("");

  const resetAppState = () => {
    setScrapedData(null);
    setTransformedData(null);
    setTransformProgress(0);
    setProgressSteps(initialProgressSteps);
    setShareUrl("");
    setIsTransforming(false);
  };

  const updateProgressStep = (stepId: string, status: ProgressStatus) => {
    setProgressSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)));
  };

  const handleDataScraped = (data: ScrapedData) => {
    setScrapedData(data);
    updateProgressStep("scrape", "completed");
    setTransformProgress(25);
  };

  const handleTransform = async () => {
    if (!scrapedData) return;

    setIsTransforming(true);
    updateProgressStep("transform", "active");
    setTransformProgress(50);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scrapedData,
          theme: selectedTheme,
        }),
      });

      updateProgressStep("render", "active");
      setTransformProgress(75);

      const result = await response.json();
      if (result.success) {
        setTransformedData(result.data);
        updateProgressStep("transform", "completed");
        updateProgressStep("render", "completed");
        updateProgressStep("complete", "completed");
        setTransformProgress(100);

        // Auto-generate share URL for new transformation
        await generateNewShareUrl(result.data);
      } else {
        updateProgressStep("transform", "error");
      }
    } catch (error) {
      console.error("Transform error:", error);
      updateProgressStep("transform", "error");
    } finally {
      setIsTransforming(false);
    }
  };

  const generateNewShareUrl = async (data: any) => {
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: data.html,
          theme: data.theme,
          originalUrl: scrapedData?.url || "",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShareUrl(result.previewUrl);
      }
    } catch (error) {
      console.error("Failed to generate share URL:", error);
    }
  };

  return (
    <div className="container">
      <InteractiveHero />
      <FeatureCards />
    </div>
  );
};

export default HomePage;
