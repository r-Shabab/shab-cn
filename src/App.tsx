import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="text-3xl">React + TS + Vite + Tailwind</div>
        <Button>Shadcn Button</Button>
      </div>
    </div>
  );
}

export default App;
