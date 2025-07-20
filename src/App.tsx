import { useMemo, useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner"; // Using sonner for toasts
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/animated-dialog";

import { useCountries } from "./hooks/useRestCountries";
import { SelectField } from "./components/ui/SelectField";

// Define form schema
const formSchema = z.object({
  country: z.string().min(1, "Please select a country"),
});

type FormValues = z.infer<typeof formSchema>;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: countries, isLoading, isError, error } = useCountries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
    },
  });

  const countryOptions = useMemo(() => {
    if (!countries) return [];

    return countries
      .map((country) => ({
        value: country.isoCode,
        label: country.name,
        icon: (
          <img src={country.flag} alt={country.name} className="h-auto w-6" />
        ),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [countries]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the selected country details
      const selectedCountry = countries?.find(
        (c) => c.isoCode === data.country,
      );

      toast.success("Form submitted successfully!", {
        description: `You selected: ${selectedCountry?.name}`,
        action: {
          label: "Undo",
          onClick: () => toast.info("Undo action triggered"),
        },
      });
      console.log("Form submitted:", data);

      reset();
    } catch {
      toast.error("Failed to submit form", {
        description: "Please try again later",
      });
    }
  };

  if (isError) {
    toast.error("Failed to load countries", {
      description: error?.message || "Please try again later",
    });
    return <div className="text-red-500">Error loading countries</div>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse">Loading countries...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
        >
          Open Dialog
        </motion.button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent isOpen={isOpen} size={"xxl"}>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <p>
                Are you sure you want to do this? This action cannot be undone.
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  toast("Action confirmed!", {
                    position: "top-center",
                  });
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectField
              options={countryOptions}
              value={value}
              onChange={onChange}
              label="Select Country"
              required
              placeholder="Choose a country..."
              error={errors.country?.message}
              onReset={() => onChange("")}
            />
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

export default App;
