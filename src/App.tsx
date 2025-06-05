import { useState } from "react";
import "./App.css";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/animated-dialog";
import { Combobox, ComboboxOption } from "./components/ui/combobox";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const roleOptions: ComboboxOption<string>[] = [
    { value: "admin", label: "Admin of EastWest BD" },
    { value: "user", label: "User" },
    { value: "guest", label: "Guest" },
  ];

  return (
    <div className="flex h-screen items-center justify-center gap-4">
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
                  // Handle confirmation action here
                  setIsOpen(false);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Combobox
          options={roleOptions}
          placeholder="Select a role..."
          value={role}
          onValueChange={setRole}
          clearable
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

export default App;
