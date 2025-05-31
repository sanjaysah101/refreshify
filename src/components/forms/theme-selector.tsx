"use client";

import { FC } from "react";

import { ensureApiKey } from "../../lib/geminiService";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Added import for custom Select components

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
    <Select
      value={selectedTheme}
      onValueChange={onThemeChange} // Changed from onChange to onValueChange
      disabled={isLoading || !ensureApiKey()}
    >
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
  </div>
);
