"use client";
import { Check, X, Search } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";

export interface ComboboxOption<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  searchText?: string;
  disabled?: boolean;
  group?: string;
}

interface ComboboxProps<T> {
  options: ComboboxOption<T>[];
  value?: T;
  onValueChange: (value: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  displayValue?: (value: T) => string;
  clearable?: boolean;
  size?: "sm" | "md" | "lg" | "default";
  variant?: "default" | "ghost" | "secondary";
  maxHeight?: number;
  loading?: boolean;
  multiple?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  icon?: React.ReactNode;
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

export function Combobox<T>({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  disabled,
  className,
  displayValue,
  clearable = true,
  size = "default",
  variant = "default",
  maxHeight = 300,
  loading = false,
  icon,
  onClear,
  onSearch,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find the selected option
  const selectedOption = options.find((option) => option.value === value);

  // Get display text for selected value
  const getDisplayText = () => {
    if (!selectedOption) return placeholder;
    if (displayValue) return displayValue(selectedOption.value);
    return selectedOption.label;
  };

  // Filter and group options
  const filteredOptions = options.filter((option) => {
    if (option.disabled) return false;
    const searchText = (option.searchText || option.label).toLowerCase();
    const query = searchValue.toLowerCase();
    return (
      searchText.includes(query) || option.label.toLowerCase().includes(query)
    );
  });

  // Group options if they have group property
  const groupedOptions = filteredOptions.reduce(
    (groups, option) => {
      const group = option.group || "default";
      if (!groups[group]) groups[group] = [];
      groups[group].push(option);
      return groups;
    },
    {} as Record<string, ComboboxOption<T>[]>,
  );

  const handleSelect = (selectedValue: T) => {
    if (selectedValue === value && clearable) {
      onValueChange(undefined as T);
    } else {
      onValueChange(selectedValue);
    }
    setOpen(false);
    setSearchValue("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(undefined as T);
  };

  const handleSearchChange = (newValue: string) => {
    setSearchValue(newValue);
    onSearch?.(newValue);
  };

  // Size variants
  const sizeClasses = {
    sm: "h-8 text-xs px-2",
    md: "h-9 text-sm px-3",
    lg: "h-11 text-base px-4",
    default: "h-full w-full text-base px-4",
  };

  // Variant classes
  const variantClasses = {
    default:
      "bg-white border-2 border-gray-200 hover:bg-white hover:border-gray-400 focus:ring-primary focus:border-primary",
    ghost:
      "bg-transparent border-transparent hover:bg-slate-100 focus:bg-white focus:border-slate-300",
    secondary:
      "bg-slate-100 border-slate-300 hover:bg-slate-200 focus:ring-2 focus:ring-slate-500",
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-label={
            selectedOption ? `Selected: ${selectedOption.label}` : placeholder
          }
          className={cn(
            "inline-flex h-10 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-normal ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            sizeClasses[size],
            variantClasses[variant],
            selectedOption && "text-slate-900 dark:text-slate-50",
            !selectedOption && "text-slate-500 dark:text-slate-400",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          disabled={disabled}
          title={getDisplayText()}
        >
          {icon && !selectedOption && <span className="shrink-0">{icon}</span>}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate">{getDisplayText()}</span>
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {clearable && selectedOption && (
              <>
                <button
                  onClick={onClear ? onClear : handleClear}
                  className="rounded-full bg-red-100 p-0.5 hover:bg-red-200"
                >
                  <X className="h-4 w-4 text-rose-400 transition-colors hover:text-rose-600" />
                </button>
                <span className="text-slate-400">
                  <PiLineVerticalThin className="h-4 w-4" />
                </span>
              </>
            )}

            {/* animate it based on the direction the portal is opened */}
            <motion.span animate={{ rotate: open ? 180 : 0 }}>
              <IoChevronDown className="h-4 w-4 text-slate-400" />
            </motion.span>
          </div>
        </motion.button>
      </PopoverTrigger>
      <AnimatePresence mode="wait">
        {open && (
          <PopoverContent
            className="w-full border-2 border-gray-100 p-0 shadow-lg"
            style={{ width: triggerRef.current?.offsetWidth }}
            sideOffset={4}
            forceMount
          >
            <motion.div
              layoutId="combobox-list"
              initial={{ opacity: 0, scale: 0.75, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Command>
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onValueChange={handleSearchChange}
                />
                <CommandList maxHeight={maxHeight}>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      {Object.entries(groupedOptions).map(
                        ([groupName, groupOptions]) => (
                          <CommandGroup key={groupName}>
                            {groupName !== "default" && (
                              <div cmdk-group-heading="">{groupName}</div>
                            )}
                            {groupOptions.map((option, index) => (
                              <CommandItem
                                key={`${groupName}-${index}`}
                                onSelect={() => handleSelect(option.value)}
                                disabled={option.disabled}
                              >
                                <motion.div
                                  className="flex w-full items-center gap-2"
                                  whileHover={{ x: 2 }}
                                  transition={{ duration: 0.1 }}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4 shrink-0 transition-opacity",
                                      value === option.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />

                                  <div className="font-medium">
                                    {option.label}
                                  </div>

                                  {option.icon && (
                                    <span className="shrink-0">
                                      {option.icon}
                                    </span>
                                  )}
                                </motion.div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ),
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
