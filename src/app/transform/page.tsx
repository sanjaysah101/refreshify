"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { THEME_OPTIONS, ThemeSelector } from "@/components/forms/theme-selector";
import { UrlInput } from "@/components/forms/url-input";
import { ExportControls } from "@/components/preview/export-controls";
import { ResponsivePreview } from "@/components/preview/responsive-preview";
import { WebsitePreview } from "@/components/preview/website-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";

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

  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const inputUrl = searchParams.get("url");
    if (inputUrl) {
      setUrl(inputUrl);
    }
  }, [searchParams]);

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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-200/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-200/10 blur-3xl" />

        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 shadow-sm backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white shadow-lg">
                  R
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent">
                    Refreshify
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    Transform websites with AI-powered design magic
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="hidden border-blue-200 bg-blue-50 text-blue-700 sm:flex">
                  ✨ AI Powered
                </Badge>
                <Button
                  variant="outline"
                  className="hidden border-blue-200 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 sm:flex"
                >
                  View Examples
                </Button>
                {(scrapedData || transformedData) && (
                  <Button
                    variant="outline"
                    onClick={resetAppState}
                    className="border-purple-200 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    Start New
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* URL Input Section */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-300 group-hover:opacity-40" />
              <div className="relative rounded-xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent">
                    Transform Any Website
                  </h2>
                  <p className="text-slate-600">Enter a URL to analyze and transform with modern AI-powered themes</p>
                </div>
                <UrlInput onDataScraped={handleDataScraped} onAnalyzeStart={resetAppState} />
              </div>
            </div>

            {/* Progress Section */}
            {(scrapedData || isTransforming) && (
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 opacity-20 blur" />
                <div className="relative rounded-xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                  <ProgressIndicator steps={progressSteps} progress={transformProgress} />
                </div>
              </div>
            )}

            {/* Theme Selection */}
            {scrapedData && !isTransforming && (
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur" />
                <div className="relative rounded-xl border border-white/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="mb-1 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
                        Choose Your Theme
                      </h2>
                      <p className="text-sm text-slate-600">
                        Select a modern design theme for your website transformation
                      </p>
                    </div>
                    <Button
                      onClick={handleTransform}
                      disabled={!selectedTheme}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                    >
                      ✨ Transform Website
                    </Button>
                  </div>
                  <ThemeSelector
                    isLoading={isTransforming}
                    idPrefix="formURL"
                    selectedTheme={selectedTheme}
                    onThemeChange={setSelectedTheme}
                  />
                </div>
              </div>
            )}

            {/* Preview Section */}
            {scrapedData && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Original Website Preview */}
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-400 opacity-20 blur transition duration-300 group-hover:opacity-30" />
                  <div className="relative overflow-hidden rounded-xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
                    <div className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
                      <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        Original Website
                      </h3>
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
                </div>

                {/* Transformed Website Preview */}
                {transformedData && (
                  <div className="group relative">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-300 group-hover:opacity-40" />
                    <div className="relative overflow-hidden rounded-xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-sm">
                      <div className="border-b border-blue-200/50 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                          Transformed Website
                          <Badge className="ml-2 border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            ✨ AI Enhanced
                          </Badge>
                        </h3>
                      </div>
                      <div className="p-4">
                        <ResponsivePreview
                          title={`${transformedData.theme} Theme`}
                          type="transformed"
                          metadata={{
                            title: scrapedData.metadata.title,
                            description: `Transformed with ${transformedData.theme} theme`,
                          }}
                          html={transformedData.html}
                        />
                        <div className="mt-6 flex justify-center">
                          <div className="relative">
                            <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur" />
                            {/* <Compare
                              firstImage={scrapedData.screenshot}
                              secondImage={transformedData.screenshot}
                              firstImageClassName="object-cover object-left-top"
                              secondImageClassname="object-cover object-left-top"
                              className="relative h-[250px] w-[400px] overflow-hidden rounded-lg shadow-lg md:h-[350px] md:w-[500px]"
                              slideMode="hover"
                              showHandlebar={true}
                            /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export Controls */}
            {transformedData && (
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 opacity-20 blur" />
                <div className="relative rounded-xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
                  <div className="border-b border-green-200/50 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                    <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                      Export & Share
                      <Badge className="ml-2 border-0 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        Ready to Deploy
                      </Badge>
                    </h3>
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
              </div>
            )}
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="relative mt-16 border-t border-white/20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-lg font-semibold text-transparent">
                  Refreshify
                </h3>
                <p className="mt-1 text-sm text-slate-600">AI-Powered Website Transformation</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Built with</span>
                <span className="text-red-500">❤️</span>
                <span>using Next.js, Tailwind CSS, and AI</span>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  Next.js 14
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  Tailwind CSS
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  AI Powered
                </Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
