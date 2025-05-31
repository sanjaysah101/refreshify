"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ThemeSelectorProps {
  selectedTheme?: string;
  onThemeChange?: (theme: string) => void;
}

const themes = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layouts with serif fonts and conservative colors",
    preview: "📰",
    colors: ["#1a1a1a", "#f8f9fa", "#6c757d"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines, sans-serif fonts, and minimalist approach",
    preview: "✨",
    colors: ["#000000", "#ffffff", "#f1f5f9"],
  },
  {
    id: "morphism",
    name: "Morphism",
    description: "Glassmorphism effects with soft shadows and translucent elements",
    preview: "🔮",
    colors: ["#667eea", "#764ba2", "rgba(255,255,255,0.1)"],
  },
  {
    id: "animated",
    name: "3D/Animated",
    description: "CSS transforms, animations, and interactive elements",
    preview: "🎭",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
  },
];

export const ThemeSelector = ({ selectedTheme = "modern", onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {themes.map((theme) => (
        <Card
          key={theme.id}
          className={`cursor-pointer p-4 transition-all hover:shadow-md ${
            selectedTheme === theme.id ? "ring-primary border-primary ring-2" : "hover:border-primary/50"
          }`}
          onClick={() => onThemeChange?.(theme.id)}
        >
          <div className="space-y-3 text-center">
            <div className="text-3xl">{theme.preview}</div>
            <div>
              <h3 className="font-semibold">{theme.name}</h3>
              <p className="text-muted-foreground mt-1 text-xs">{theme.description}</p>
            </div>
            <div className="flex justify-center gap-1">
              {theme.colors.map((color, index) => (
                <div
                  key={index}
                  className="border-border h-4 w-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {selectedTheme === theme.id && (
              <Badge variant="default" className="text-xs">
                Selected
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
