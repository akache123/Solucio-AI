import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, X } from "lucide-react";

export default function Onboarding() {
  const foodList = [
    {
      name: "Pizza",
      cuisine: "Italian",
    },
    {
      name: "Burger",
      cuisine: "American",
    },
    {
      name: "Noodles",
      cuisine: "Chinese",
    },
  ];

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="w-3/5 p-4">
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold first:mt-0">
          Swipe to personalize your food
        </h1>

        <p className="text-lg text-muted-foreground tracking-normal">
          Your selections and ordering habits will be used to recommend new
          dishes each time you use the app.
        </p>
      </div>

      <div className="flex justify-center w-full p-4">
        <div className="flex flex-col">
          <Carousel>
            <CarouselContent>
              {foodList.map((food, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {food.name}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex flex-row justify-center items-center mt-3">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full hover:bg-red-200"
            >
              <X className="w-4 h-4 text-red-800" />
            </Button>

            <p className="text-sm font-light text-secondary-foreground px-12 tracking-widest">
              1/5
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full hover:bg-green-200"
            >
              <Check className="w-4 h-4 text-green-800" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
