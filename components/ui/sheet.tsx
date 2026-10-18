"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

function SheetContent({
  className,
  children,
  side = "right",
  closeLabel = "Close",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "right" | "left"; closeLabel?: string }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-[61] flex w-full max-w-md flex-col border-foreground/10 bg-background shadow-2xl transition-transform duration-300",
          side === "right" ? "end-0 border-s" : "start-0 border-e",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute end-4 top-4 rounded-full p-2 text-foreground/70 hover:bg-foreground/10 hover:text-foreground" aria-label={closeLabel}>
          <XIcon className="size-5" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetTitle = ({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title className={cn("font-display text-lg tracking-wide", className)} {...props} />
);
const SheetDescription = SheetPrimitive.Description;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
