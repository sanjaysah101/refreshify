"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, SparkleIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ShinyText } from "./shiny-text";

interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "error";
  description?: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
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
    <TooltipProvider delayDuration={300}>
      <Card className="group border-white/10 bg-white/5 p-6 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="z-10 text-xl font-medium"
            >
              <span className="flex items-center justify-center gap-2">
                <SparkleIcon className="h-4 w-4" />
                Transformation Progress
              </span>
            </motion.h3>
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>

          <Progress value={progress} className="w-full bg-gray-300" />

          <div className="space-y-3">
            <AnimatePresence>
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex items-start gap-3 rounded-md px-2 py-1 transition-colors duration-300 ${
                    step.status === "active" ? "bg-blue-950/20 ring-1 ring-blue-500/50" : ""
                  }`}
                >
                  <Tooltip>
                    <TooltipTrigger>{getStepIcon(step.status)}</TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Status: {step.status}</p>
                    </TooltipContent>
                  </Tooltip>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className={`text-sm font-medium ${
                          step.status === "completed"
                            ? "text-green-500"
                            : step.status === "error"
                              ? "text-red-500"
                              : step.status === "active"
                                ? "text-blue-400"
                                : "text-gray-300"
                        }`}
                      >
                        {step.label}
                      </motion.span>

                      {step.status === "active" && (
                        <ShinyText
                          text="Processing..."
                          className="cursor-pointer rounded-full border border-gray-700 bg-[#1a1a1a] px-3 py-0.5 text-xs font-medium text-[#0CF2A0] transition-colors hover:border-[#0CF2A0]/50 sm:text-sm"
                        />
                      )}
                    </div>

                    {step.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-xs"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
