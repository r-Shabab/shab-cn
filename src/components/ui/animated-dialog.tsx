import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid gap-4 border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950 rounded-lg",
  {
    variants: {
      size: {
        // Compact dialog - minimal space for simple confirmations
        xs: "w-[90vw] max-w-xs sm:w-[75vw] sm:max-w-sm md:w-[60vw] md:max-w-md lg:w-[45vw] lg:max-w-lg xl:w-[35vw] xl:max-w-xl 2xl:w-[25vw] 2xl:max-w-2xl",

        // Small dialog - compact for mobile, slightly larger on desktop
        sm: "w-[95vw] max-w-sm sm:w-[85vw] sm:max-w-md md:w-[75vw] md:max-w-lg lg:w-[60vw] lg:max-w-xl xl:w-[45vw] xl:max-w-2xl 2xl:w-[35vw] 2xl:max-w-3xl",

        // Default dialog - balanced across all screens
        default:
          "w-[95vw] max-w-md sm:w-[85vw] sm:max-w-lg md:w-[75vw] md:max-w-xl lg:w-[65vw] lg:max-w-2xl xl:w-[50vw] xl:max-w-3xl 2xl:w-[40vw] 2xl:max-w-4xl",

        // Large dialog - spacious for content-heavy dialogs
        lg: "w-[95vw] max-w-lg sm:w-[90vw] sm:max-w-xl md:w-[85vw] md:max-w-2xl lg:w-[80vw] lg:max-w-3xl xl:w-[70vw] xl:max-w-4xl 2xl:w-[60vw] 2xl:max-w-5xl",

        // Extra large dialog - for complex forms or dashboards
        xl: "w-[95vw] max-w-xl sm:w-[90vw] sm:max-w-2xl md:w-[85vw] md:max-w-3xl lg:w-[80vw] lg:max-w-4xl xl:w-[75vw] xl:max-w-5xl 2xl:w-[65vw] 2xl:max-w-6xl",

        // Wide dialog - optimized for horizontal content
        xxl: "w-[95vw] max-w-3xl sm:w-[90vw] sm:max-w-4xl md:w-[85vw] md:max-w-5xl lg:w-[80vw] lg:max-w-6xl xl:w-[75vw] xl:max-w-7xl 2xl:w-[70vw] 2xl:max-w-[90rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} asChild {...props}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
    />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    isOpen: boolean;
    size?: VariantProps<typeof dialogContentVariants>["size"];
  } & VariantProps<typeof dialogContentVariants>
>(({ className, children, isOpen, size, ...props }, ref) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <DialogPortal forceMount>
        <DialogOverlay />
        <DialogPrimitive.Content ref={ref} {...props} asChild>
          <motion.div
            initial={{
              scale: 0.25,
              opacity: 0,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: "-50%",
              y: "-50%",
            }}
            exit={{
              scale: 0.25,
              opacity: 0,
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className={cn(dialogContentVariants({ size }), className)}
          >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:bg-red-100 hover:text-red-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-300 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
              <X className="size-6" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    )}
  </AnimatePresence>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
