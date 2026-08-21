import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import "./index.css"

document.documentElement.dataset.uiTheme = "tis"

function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-background text-foreground">
      <Dialog>
        <DialogTrigger render={<Button />}>Open consumer dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Installed from source registry</DialogTitle>
            <DialogDescription>
              Behavior, source and the optional TIS theme were resolved automatically.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
