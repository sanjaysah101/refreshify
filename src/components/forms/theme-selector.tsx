"use client";

import { FC } from "react";

import { motion } from "framer-motion";

import { ensureApiKey } from "../../lib/geminiService";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Added import for custom Select components

interface ThemeSelectorProps {
  idPrefix: string;
  selectedTheme: string;
  onThemeChange: (value: string) => void;
  isLoading: boolean;
  handleTransform: () => void;
}

export const THEME_OPTIONS = [
  { value: "Default (AI's Best Guess)", label: "Default (AI's Best Guess)" },
  { value: "Sleek Dark Mode", label: "Sleek Dark Mode" },
  { value: "Clean Light Mode", label: "Clean Light Mode" },
  { value: "Vibrant & Playful", label: "Vibrant & Playful" },
  { value: "Professional Corporate", label: "Professional Corporate" },
  { value: "Retro Futuristic", label: "Retro Futuristic" },
  { value: "Minimalist Zen", label: "Minimalist Zen" },
];

export const ThemeSelector: FC<ThemeSelectorProps> = ({
  idPrefix,
  selectedTheme,
  onThemeChange,
  isLoading,
  handleTransform,
}) => (
  <Card className="group border-white/10 bg-white/5 p-6 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-start gap-2">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="z-10 text-xl font-medium"
        >
          <span className="flex items-center justify-center gap-2">Choose Your Theme</span>
        </motion.h3>
        <p className="text-sm">Select a modern design theme for your website transformation</p>
      </div>
      <Button
        onClick={handleTransform}
        disabled={!selectedTheme}
        className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
      >
        ✨ Transform Website
      </Button>
    </div>
    <Label htmlFor={`${idPrefix}Theme`} className="">
      Select Modernization Theme
    </Label>
    <Select value={selectedTheme} onValueChange={onThemeChange} disabled={isLoading || !ensureApiKey()}>
      <SelectTrigger id={`${idPrefix}Theme`} className="w-full">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        {THEME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Card>
);
