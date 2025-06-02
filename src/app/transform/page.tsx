"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { THEME_OPTIONS, ThemeSelector } from "@/components/forms/theme-selector";
import { UrlInput } from "@/components/forms/url-input";
import { ExportControls } from "@/components/preview/export-controls";
import { ResponsivePreview } from "@/components/preview/responsive-preview";
import { Badge } from "@/components/ui/badge";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import {
  PreviewData,
  ProgressStatus,
  ProgressStep,
  ScrapedData,
  TransformedData,
  initialProgressSteps,
} from "@/lib/types";

import { Card } from "../../components/ui/card";
import { Compare } from "../../components/ui/compare";
import { ShinyText } from "../../components/ui/shiny-text";

const TransformPage = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>(THEME_OPTIONS[0].value);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedData, setTransformedData] = useState<TransformedData | null>(null);
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
      // eslint-disable-next-line no-console
      console.error("Transform error:", error);
      updateProgressStep("transform", "error");
    } finally {
      setIsTransforming(false);
    }
  };

  const generateNewShareUrl = async (data: PreviewData) => {
    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setShareUrl(result.previewUrl);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to generate share URL:", error);
    }
  };

  const handleNewShareUrl = async (data: TransformedData) => {
    if (scrapedData) {
      generateNewShareUrl({ ...data, ...scrapedData });
    }
  };

  return (
    <div className="container flex flex-col gap-6">
      <UrlInput url={url} setUrl={setUrl} onDataScraped={handleDataScraped} onAnalyzeStart={resetAppState} />

      {(scrapedData || isTransforming) && <ProgressIndicator steps={progressSteps} progress={transformProgress} />}

      {/* Theme Selection */}
      {scrapedData && (
        <ThemeSelector
          isLoading={isTransforming}
          idPrefix="formURL"
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          handleTransform={handleTransform}
        />
      )}

      {/* Preview Section */}
      {scrapedData && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Original Website Preview */}
          <div className="group relative">
            <div className="rounded- absolute -inset-1 opacity-20 blur transition duration-300 group-hover:opacity-30" />
            <div className="relative overflow-hidden rounded-xl border border-white/50 shadow-lg backdrop-blur-sm">
              <div className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100/50 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                  Original Website
                </h3>
              </div>
              <div className="p-4">
                <ResponsivePreview type="original" {...scrapedData} />
              </div>
            </div>
          </div>

          {/* Transformed Website Preview */}
          {transformedData && (
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-300 group-hover:opacity-40" />
              <div className="relative overflow-hidden rounded-xl border border-white/50 shadow-xl backdrop-blur-sm">
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
                    // title={`${transformedData.theme} Theme`}
                    type="transformed"
                    // metadata={{
                    //   title: scrapedData.metadata.title,
                    //   description: `Transformed with ${transformedData.theme} theme`,
                    // }}
                    // html={transformedData.html}
                    // screenshot={transformedData.screenshot}
                    {...scrapedData}
                  />
                  <div className="mt-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur" />
                      <Compare
                        firstImage={scrapedData.screenshot}
                        secondImage={transformedData.transformedScreenshot}
                        firstImageClassName="object-cover object-left-top"
                        secondImageClassname="object-cover object-left-top"
                        className="relative h-[250px] w-[400px] overflow-hidden rounded-lg shadow-lg md:h-[350px] md:w-[500px]"
                        slideMode="hover"
                        showHandlebar={true}
                      />
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
        <Card className="group border-white/10 bg-white/5 p-6 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
          <div className="border-b border-green-200/50 p-4 pl-0">
            <h3 className="flex items-center gap-2 font-semibold">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
              Export & Share
              <ShinyText
                text=" Ready to Deploy"
                className="cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] px-3 py-0.5 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
              />
            </h3>
          </div>
          <ExportControls transformedData={transformedData} shareUrl={shareUrl} onNewShareUrl={handleNewShareUrl} />
        </Card>
      )}
    </div>
  );
};

function SearchBarFallback() {
  return (
    <div className="container flex max-h-full max-w-full items-center justify-center">
      <span className="animate-pulse">loading...</span>
    </div>
  );
}

const TransformPageWrapper = () => {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <TransformPage />
    </Suspense>
  );
};

export default TransformPageWrapper;
