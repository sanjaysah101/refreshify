"use client";

import { useState } from "react";

import { THEME_OPTIONS, ThemeSelector } from "@/components/forms/theme-selector";
import { UrlInput } from "@/components/forms/url-input";
import { ExportControls } from "@/components/preview/export-controls";
import { ResponsivePreview } from "@/components/preview/responsive-preview";
import { WebsitePreview } from "@/components/preview/website-preview";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";

import InteractiveHero from "../components/hero-section-nexus";
import { Compare } from "../components/ui/compare";
import { callOpenAI } from "../lib/openAI";

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
    <>
      <InteractiveHero />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  RebuildWeb
                </h1>
                <p className="mt-1 text-sm text-slate-600">Transform any website into a modern masterpiece with AI</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={callOpenAI} className="hidden sm:flex">
                  View Examples
                </Button>
                {(scrapedData || transformedData) && (
                  <Button variant="outline" onClick={resetAppState}>
                    Start New
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* URL Input Section */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <UrlInput onDataScraped={handleDataScraped} onAnalyzeStart={resetAppState} />
            </div>

            {/* Progress Section */}
            {(scrapedData || isTransforming) && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <ProgressIndicator steps={progressSteps} progress={transformProgress} />
              </div>
            )}

            {/* Theme Selection */}
            {scrapedData && !isTransforming && (
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Choose Your Theme</h2>
                  <Button
                    onClick={handleTransform}
                    disabled={!selectedTheme}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Transform Website
                  </Button>
                </div>
                <ThemeSelector
                  isLoading={isTransforming}
                  idPrefix="formURL"
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                />
              </div>
            )}

            {/* Preview Section */}
            {scrapedData && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Original Website Preview */}
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <div className="border-b bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-800">Original Website</h3>
                  </div>
                  <WebsitePreview
                    title={scrapedData.metadata.title}
                    screenshot={scrapedData.screenshot}
                    type="original"
                    metadata={{
                      title: scrapedData.metadata.title,
                      description: scrapedData.metadata.description,
                    }}
                  />
                </div>

                {/* Transformed Website Preview */}
                {transformedData && (
                  <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                      <h3 className="font-semibold text-slate-800">Transformed Website</h3>
                    </div>
                    <ResponsivePreview
                      title={`${transformedData.theme} Theme`}
                      type="transformed"
                      metadata={{
                        title: scrapedData.metadata.title,
                        description: `Transformed with ${transformedData.theme} theme`,
                      }}
                      html={transformedData.html}
                    />
                    <Compare
                      firstImage={scrapedData.screenshot}
                      secondImage={transformedData.screenshot}
                      firstImageClassName="object-cover object-left-top"
                      secondImageClassname="object-cover object-left-top"
                      className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
                      slideMode="hover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Export Controls */}
            {transformedData && (
              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b bg-gradient-to-r from-green-50 to-blue-50 p-4">
                  <h3 className="font-semibold text-slate-800">Export & Share</h3>
                </div>
                <div className="p-6">
                  <ExportControls
                    transformedData={transformedData}
                    originalUrl={scrapedData?.url}
                    shareUrl={shareUrl}
                    onNewShareUrl={generateNewShareUrl}
                  />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="mt-16 border-t bg-slate-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-slate-600">
              <p className="text-sm">Built with ❤️ using Next.js, Tailwind CSS, and AI</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
