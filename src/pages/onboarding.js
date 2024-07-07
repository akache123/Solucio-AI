import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import useSwr from "swr";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

import { Check, LoaderCircle, X } from "lucide-react";

function useFoodList() {
  // https://swr.vercel.app/docs/getting-started

  const { data, error, isLoading, isValidating } = useSwr(
    "/api/generate-first-swipes",
    (...args) => fetch(...args).then((res) => res.json()),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    foodList: data,
    isFoodLoading: isLoading || isValidating,
    isFoodError: error,
  };
}

export default function Onboarding() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  // Fetch food items to prompt the user for their preferences
  // const { foodList, isFoodLoading } = useFoodList();
  const { foodList, isFoodLoading } = useFoodList();
  const [current, setCurrent] = useState(0);

  // liked (bool): true if user clicks "Yes", false if user clicks "No"
  function select(liked) {
    if (isFoodLoading) {
      return;
    }

    // Asynchronously make a POST request to the swipe endpoint
    // Depends on user state (`current`), but it'll work since the request is always
    // queued before the state is updated
    fetch(`/api/swipe_${liked ? "right" : "left"}`, {
      headers: {
        "Content-Type": "application/json", // ! Must set Content-Type for the API to parse body
      },
      method: "POST",
      body: JSON.stringify({
        clerkId: user.id,
        objectId: foodList[current]._id,
      }),
    }).catch((error) => console.log(error));

    // Only allow the user to move to the next card if there's space available
    // Otherwise, redirect to the dashboard
    if (current < foodList.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="w-2/5 grow-0">
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
      <div className="flex-grow">
        <div className="flex flex-col">
          <Card className="">
            <CardHeader>
              {isFoodLoading ? (
                <>
                  <div className="h-80 mb-4 bg-gray-300 rounded-md flex justify-center items-center animate-pulse">
                    <span className="text-gray-500">Loading Image</span>
                  </div>
                  <CardTitle>Loading...</CardTitle>
                  <CardDescription>Loading...</CardDescription>
                </>
              ) : (
                <>
                  <div className="h-80 mb-4 bg-gray-300 rounded-md flex justify-center items-center">
                    <span className="text-gray-500">Image Placeholder</span>
                  </div>
                  <CardTitle>{foodList[current].name}</CardTitle>
                  <CardDescription>{foodList[current].cuisine}</CardDescription>
                </>
              )}
            </CardHeader>
          </Card>

          <div className="flex flex-row justify-center items-center mt-3">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full hover:bg-red-200"
              onClick={() => select(false)}
              disabled={isFoodLoading}
            >
              <X className="w-4 h-4 text-red-800" />
            </Button>

            <div className="min-w-10 md:min-w-32 flex items-center justify-center">
              {isFoodLoading ? (
                <LoaderCircle className="w-4 h-4 animate-spin text-center" />
              ) : (
                <p className="text-center text-sm font-light text-secondary-foreground ">
                  {current + 1} / {foodList.length}
                </p>
              )}
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full hover:bg-green-200"
              onClick={() => select(true)}
              disabled={isFoodLoading}
            >
              <Check className="w-4 h-4 text-green-800" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
