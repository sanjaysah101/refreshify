import { cn } from "@/lib/utils";

interface NavLinkProps {
  text: string | React.ReactNode;
  className?: string;
}

export const ShinyText: React.FC<NavLinkProps> = ({ text, className = "" }) => (
  <span className={cn("relative inline-block overflow-hidden", className)}>
    {text}
    <span
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        animation: "shine 2s infinite linear",
        opacity: 0.5,
        pointerEvents: "none",
      }}
    ></span>
    <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
  </span>
);
