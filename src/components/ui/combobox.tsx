"use client";
import { Check, X, Search } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useRef, useMemo, useCallback } from "react";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";

export interface ComboboxOption<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps<T> {
  options: ComboboxOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  resettable?: boolean;
  onReset?: () => void;
  icon?: React.ReactNode;
  error?: string;
  touched?: boolean;
  optionComponent?: (option: ComboboxOption<T>) => React.ReactNode;
}

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

export function Combobox<T>({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  disabled,
  className,
  resettable = true,
  icon,
  onReset,
  error,
  touched,
  optionComponent,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Memoize selected option lookup
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );
  // Memoize options to avoid unnecessary re-renders
  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onReset) {
        onReset();
      } else {
        onChange(null as unknown as T); // Reset to null or undefined
      }

      setOpen(false);
    },
    [onChange, onReset],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-label={
            selectedOption ? `Selected: ${selectedOption.label}` : placeholder
          }
          className={cn(
            "focus:border-primary inline-flex h-14 w-full items-center justify-between gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm text-slate-900 transition-colors hover:border-gray-400 disabled:pointer-events-none disabled:opacity-50",
            className,
            disabled && "cursor-not-allowed opacity-50",
            error && touched && "border-red-500",
            !selectedOption && "text-gray-500",
          )}
          disabled={disabled}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {icon && !selectedOption && (
              <span className="shrink-0">{icon}</span>
            )}
            <span className="truncate text-left">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {resettable && selectedOption && (
              <>
                <button
                  onClick={handleReset}
                  className="group rounded-full bg-red-100 p-0.5 hover:bg-red-200 focus:border-red-500"
                  type="button"
                  aria-label="Reset selection"
                  aria-describedby="reset-selection"
                >
                  <X className="h-4 w-4 text-rose-400 transition-colors group-hover:text-rose-600" />
                </button>
                <span className="text-slate-400">
                  <PiLineVerticalThin className="h-4 w-4" />
                </span>
              </>
            )}

            {/* animate it based on the direction the portal is opened */}
            <IoChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : "rotate-0"}`}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full border-2 border-gray-100 p-0 shadow-lg"
        style={{ width: triggerRef.current?.offsetWidth }}
        sideOffset={4}
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
          />
          <CommandList className="max-h-60 overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-slate-500">
              {emptyMessage}
            </CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                disabled={option.disabled}
                className="group"
              >
                <div className="flex w-full items-center gap-2 transition-transform duration-75 group-hover:translate-x-1">
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0 transition-opacity",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {/* if custom optionComponent is provided, use it to render the option otherwise, use the default rendering */}
                  {optionComponent ? (
                    optionComponent(option)
                  ) : (
                    <>
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}

                      <div className="font-medium">{option.label}</div>
                    </>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
