export interface ScrapedData {
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
  html: string;
}

export type ProgressStatus = "pending" | "active" | "completed" | "error";

export interface ProgressStep {
  id: string;
  label: string;
  status: ProgressStatus;
  description: string;
}

export interface TransformedData {
  transformedHtml: string;
  transformedScreenshot: string;
  theme: string;
  transformedAt: string;
}

export const initialProgressSteps: ProgressStep[] = [
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

export interface PreviewData extends ScrapedData, TransformedData {}
