import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full flex-grow rounded-md border border-gray-700 bg-transparent px-4 py-2 text-white placeholder-gray-500 transition-all focus:border-transparent focus:ring-2 focus:ring-[#0CF2A0] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
