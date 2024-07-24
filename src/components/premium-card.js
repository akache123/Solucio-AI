import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CookingPot, ChefHat, Sparkles } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { ThumbsDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Skeleton } from "./ui/skeleton";

import { cn } from "../lib/utils";

export function PremiumCard({ premiumRecommendation, isLoading }) {
  if (Array.isArray(premiumRecommendation)) {
    premiumRecommendation = premiumRecommendation[0];
  }

  return (
    <>
      <div className="relative mb-4 w-2/3 mx-auto flex-1">
        <Badge
          className={
            isLoading
              ? "mr-2 mb-2 border border-white bg-black animate-pulse text-white"
              : "mr-2 mb-2 border border-white bg-black text-white"
          }
          variant="outline"
        >
          {isLoading ? (
            <CookingPot className="mr-2 w-6 h-6" style={{ color: "#FFD700" }} />
          ) : (
            <ChefHat className={"mr-2 w-6 h-6"} style={{ color: "#FFD700" }} />
          )}

          {"Premium Recommendation " + (isLoading ? "is cooking..." : "")}
        </Badge>

        {premiumRecommendation && !isLoading ? (
          <div className="flex border rounded-md items-center shadow-lg shadow-yellow-500/50">
            <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <div className="p-4 flex flex-col justify-between w-2/3">
              <CardHeader>
                <div className="flex">
                  <CardTitle style={{ marginRight: "10px" }}>
                    {premiumRecommendation.name}
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger>
                      <Maximize2 />
                    </DialogTrigger>
                    <DialogContent className="flex flex-row">
                      <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
                        <span className="text-gray-500">Image Placeholder</span>
                      </div>
                      <div className="flex flex-col p-4 w-2/3">
                        <DialogHeader>
                          <DialogTitle>
                            {premiumRecommendation.name}
                          </DialogTitle>
                          <DialogDescription>
                            {premiumRecommendation.cuisine}
                            <Badge className="bg-gray-300 ml-2">
                              {premiumRecommendation.calories} cal
                            </Badge>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <p className="text-lg font-bold">
                            {premiumRecommendation.price}
                          </p>
                          <hr className="my-2 border-gray-300" />
                          <p>{premiumRecommendation.restaurantName}</p>
                          <p>{premiumRecommendation.address}</p>
                          <p>
                            Website:
                            <a
                              href={premiumRecommendation.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 underline"
                            >
                              {premiumRecommendation.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  {premiumRecommendation.cuisine}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Description</p>
              </CardContent>
              <hr className="my-2 border-gray-300" />
            </div>
          </div>
        ) : (
          <Skeleton className={"h-40"} />
        )}
      </div>
    </>
  );
}
