import { cn } from "@/lib/utils";
import { Combobox, ComboboxProps } from "@/components/ui/combobox"; // Adjust import path
import { Label } from "@/components/ui/label"; // Adjust import path

interface SelectFieldProps<T> extends ComboboxProps<T> {
  label: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

export function SelectField<T>({
  label,
  required = false,
  className,
  labelClassName,
  ...comboboxProps
}: SelectFieldProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1">
        <Label
          className={cn("text-sm font-medium leading-none", labelClassName)}
        >
          {label}
        </Label>
        {required && (
          <span className="text-red-500" aria-label="Required field">
            *
          </span>
        )}
      </div>

      <Combobox<T> {...comboboxProps} />
      {comboboxProps.error && comboboxProps.touched && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {comboboxProps.error}
        </p>
      )}
    </div>
  );
}
