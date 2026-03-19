import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={className}
    style={{
      zIndex: 50,
      overflow: "hidden",
      borderRadius: "8px",
      backgroundColor: "#2C2C2C",
      color: "#FAFAF8",
      padding: "6px 12px",
      fontSize: "12px",
      fontFamily: "'Noto Sans JP', sans-serif",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
      animationDuration: "200ms",
    }}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
