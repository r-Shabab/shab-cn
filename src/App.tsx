import { useState } from "react";
import "./App.css";

import { Button } from "./components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/animated-dialog";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent isOpen={isOpen}>
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
  );
}

export default App;
