"use client";

import { FC } from "react";

import { ensureApiKey } from "../../lib/geminiService";
import { Label } from "../ui/label";

interface ThemeSelectorProps {
  idPrefix: string;
  selectedTheme: string;
  onThemeChange: (value: string) => void;
  isLoading: boolean;
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

export const ThemeSelector: FC<ThemeSelectorProps> = ({ idPrefix, selectedTheme, onThemeChange, isLoading }) => (
  <div className="mb-6">
    <Label htmlFor={`${idPrefix}Theme`} className="bloc mb-2">
      Select Modernization Theme
    </Label>
    <select
      id={`${idPrefix}Theme`}
      value={selectedTheme}
      onChange={(e) => onThemeChange(e.target.value)}
      className="w-full rounded-lg border-2 border-gray-600 p-3 text-gray-200 shadow-sm transition-shadow duration-300 focus:border-indigo-500 focus:shadow-md focus:ring-3 focus:ring-indigo-500"
      disabled={isLoading || !ensureApiKey()}
      aria-label="Select modernization theme"
    >
      {THEME_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
