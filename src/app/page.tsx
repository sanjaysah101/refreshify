"use client";

import { useState } from "react";

import { THEME_OPTIONS, ThemeSelector } from "@/components/forms/theme-selector";
import { UrlInput } from "@/components/forms/url-input";
import { ExportControls } from "@/components/preview/export-controls";
import { ResponsivePreview } from "@/components/preview/responsive-preview";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
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

const HomePage = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>(THEME_OPTIONS[0].value);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedData, setTransformedData] = useState<any>(null);
  const [transformProgress, setTransformProgress] = useState(0);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
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
  ]);

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

  return (
    <div className="from-background to-muted min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">RebuildWeb</h1>
              <p className="text-muted-foreground text-sm">Transform any website into a modern masterpiece</p>
            </div>
            <Button variant="outline" onClick={callOpenAI}>View Examples</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold">Modernize Any Website in Minutes</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Enter any URL and watch as our AI transforms outdated websites into beautiful, modern, responsive designs.
            </p>
          </div>

          {/* Transformation Form */}
          <div className="bg-card mb-8 rounded-lg border p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Start Your Transformation</h3>
                <UrlInput onDataScraped={handleDataScraped} />
              </div>

              {scrapedData && (
                <>
                  <div>
                    <h4 className="mb-3 text-lg font-medium">Choose Your Theme</h4>
                    <ThemeSelector
                      isLoading={isTransforming}
                      idPrefix="urlForm"
                      selectedTheme={selectedTheme}
                      onThemeChange={setSelectedTheme}
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button size="lg" className="px-8" onClick={handleTransform} disabled={isTransforming}>
                      {isTransforming ? "Transforming..." : "Transform Website"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          {(scrapedData || isTransforming) && (
            <div className="mb-8">
              <ProgressIndicator steps={progressSteps} progress={transformProgress} />
            </div>
          )}

          {/* Preview Comparison */}
          {scrapedData && (
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              <ResponsivePreview
                title="Original Website"
                screenshot={scrapedData.screenshot}
                type="original"
                metadata={scrapedData.metadata}
              />

              {transformedData && (
                <ResponsivePreview
                  title="Transformed Website"
                  screenshot={transformedData.screenshot}
                  type="transformed"
                  metadata={{
                    title: `${scrapedData.metadata.title} (${selectedTheme} theme)`,
                    description: `Modernized with ${selectedTheme} design system`,
                  }}
                  html={transformedData.html}
                />
              )}
            </div>
          )}

          {/* Export Controls */}
          {transformedData && (
            <div className="mb-8">
              <ExportControls transformedData={transformedData} originalUrl={scrapedData?.url} />
            </div>
          )}

          {/* Features Grid */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="mb-2 font-semibold">Multiple Themes</h3>
              <p className="text-muted-foreground text-sm">
                Choose from Classic, Modern, Morphism, and Animated themes
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="mb-2 font-semibold">Fully Responsive</h3>
              <p className="text-muted-foreground text-sm">All transformations are mobile-first and responsive</p>
            </div>

            <div className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="mb-2 font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Get your transformed website in under 60 seconds</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
