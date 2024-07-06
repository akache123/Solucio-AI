import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

export default function Onboarding() {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-2/5">
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">
          Swipe to personalize your food
        </h1>

        <p className="text-lg text-muted-foreground">
          Your selections and ordering habits will be used to recommend new
          dishes each time you use the app.
        </p>
      </div>
      <div className="flex w-full justify-center">
        <Carousel>
          <CarouselContent>
            <CarouselItem>Item 1</CarouselItem>
            <CarouselItem>Item 2</CarouselItem>
            <CarouselItem>Item 3</CarouselItem>
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
