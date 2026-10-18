import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * Glitch theme buttons: sharp, black and white, hand-drawn borders.
 * Main actions are hatched (.sk-hatch), the rest are outlined (.sk); the sketch SVG
 * and the tap glitch come from components/site/glitch-fx.tsx.
 */
const buttonVariants = cva(
  "tap inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors select-none disabled:pointer-events-none disabled:opacity-40 [&_svg:not(.sketch)]:pointer-events-none [&_svg:not(.sketch)]:shrink-0 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "sk-hatch",
        grad: "sk-hatch",
        white: "sk-hatch",
        outline: "sk",
        ghost: "text-foreground/80 hover:text-foreground hover:underline underline-offset-4",
        whatsapp: "sk",
      },
      size: {
        default: "h-11 px-6 text-sm [&_svg:not(.sketch)]:size-4",
        sm: "h-9 px-4 text-[13px] [&_svg:not(.sketch)]:size-4",
        lg: "h-14 px-8 text-base [&_svg:not(.sketch)]:size-5",
        icon: "h-10 w-10 [&_svg:not(.sketch)]:size-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
