import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      <Search className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
      <CommandPrimitive.Input
        className={cn(
          "flex-1 bg-transparent text-sm placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  maxHeight = 300,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List> & {
  maxHeight?: number;
}) {
  return (
    <CommandPrimitive.List
      className={cn("overflow-y-auto overflow-x-hidden p-1", className)}
      style={{ maxHeight }}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn(
        "py-8 text-center text-sm text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-slate-600 dark:[&_[cmdk-group-heading]]:text-slate-300",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-3 rounded-md px-2 py-2.5 text-sm transition-all duration-150 hover:bg-slate-100 data-[disabled=true]:pointer-events-none data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900 data-[disabled=true]:opacity-50 dark:hover:bg-slate-800 dark:data-[selected=true]:bg-slate-800 dark:data-[selected=true]:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};
