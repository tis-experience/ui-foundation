import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import ConsumerApp from "../../fixtures/consumer-template/src/App"
import "@/index.css"
import "@/examples/consumer.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConsumerApp catalogHref="../../" />
  </StrictMode>,
)
