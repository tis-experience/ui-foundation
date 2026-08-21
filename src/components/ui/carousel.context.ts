import * as React from "react"

import type { CarouselApi, CarouselContextValue } from "@/components/ui/carousel.types"

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

export { CarouselContext, useCarousel }
export type { CarouselApi }
