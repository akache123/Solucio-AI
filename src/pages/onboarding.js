import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Onboarding() {
  const router = useRouter();

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

  const [api, setApi] = useState();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);

  // Responsible for updating the text in-between both buttons
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Called when the user clicks either Yes or No buttons
  // liked (bool): whether the user clicked "yes" (true) or "no" (false)
  function select(liked) {
    if (!api) {
      return;
    }

    console.log(
      `User selected ${liked ? "Yes" : "No"} on item ${current}/${count}`
    );

    // If there are food items left, allow the user to scroll
    // Otherwise, simply redirect them to the dashboard. This prevents them from re-clicking
    // the buttons when they hit the last food item
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex flex-row w-full">
      <div className="w-3/5 p-4">
        <h1 className="scroll-m-20 pb-2 text-4xl font-semibold first:mt-0">
          Swipe to personalize your food
        </h1>

        <p className="text-lg text-muted-foreground tracking-normal">
          Your selections and ordering habits will be used to recommend new
          dishes each time you use the app.
        </p>
      </div>

      {/* NOTE: `watchDrag` enables/disables dragging to scroll
      https://www.embla-carousel.com/api/options/#watchdrag */}
      <div className="flex justify-center w-full p-4">
        <div className="flex flex-col">
          <Carousel setApi={setApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              {foodList.map((food, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col p-6">
                        <div className="h-40 bg-gray-300 rounded-md flex justify-center items-center md:h-96">
                          <span className="text-gray-500">
                            Image Placeholder
                          </span>
                        </div>
                        <div className="mt-6">
                          <span className="text-3xl font-semibold">
                            {food.name}
                          </span>
                          <br />
                          <span className="text-md font-normal text-muted-foreground tracking-wide">
                            {food.cuisine}
                          </span>
                        </div>
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
              onClick={() => select(false)}
            >
              <X className="w-4 h-4 text-red-800" />
            </Button>

            <p className="text-center text-sm font-light text-secondary-foreground tracking-widest min-w-10 md:min-w-32">
              {current}/{count}
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full hover:bg-green-200"
              onClick={() => select(true)}
            >
              <Check className="w-4 h-4 text-green-800" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
