"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
  description?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
  progress?: number;
}

export const ProgressIndicator = ({ steps, progress = 0 }: ProgressIndicatorProps) => {
  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "active":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <div className="border-muted h-5 w-5 rounded-full border-2" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Transformation Progress</h3>
          <span className="text-muted-foreground text-sm">{Math.round(progress)}%</span>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              {getStepIcon(step.status)}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      step.status === "completed"
                        ? "text-green-700"
                        : step.status === "error"
                          ? "text-red-700"
                          : step.status === "active"
                            ? "text-blue-700"
                            : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.status === "active" && (
                    <span className="animate-pulse text-xs text-blue-600">Processing...</span>
                  )}
                </div>
                {step.description && <p className="text-muted-foreground mt-1 text-xs">{step.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
