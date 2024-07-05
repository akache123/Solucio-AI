import * as React from "react"
import Image from "next/image"
 
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Bold } from "lucide-react"
 
import { Toggle } from "@/components/ui/toggle"
 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"


const foodList = [
  {
    name: "pizza",
    cuisine: "Italian",
    tags: ["spicy", "contains-egg", "cheese"],
  },
  {
    name: "burger",
    cuisine: "american",
    tags: ["spicy", "contains-egg", "cheese"],
  },
  {
    name: "noodles",
    cuisine: "chinese",
    tags: ["spicy", "contains-egg", "cheese"],
  },
  {
    name: "pizza",
    cuisine: "Italian",
    tags: ["spicy", "contains-egg", "cheese"],
  },
  {
    name: "burger",
    cuisine: "american",
    tags: ["spicy", "contains-egg", "cheese"],
  },
  {
    name: "noodles",
    cuisine: "chinese",
    tags: ["spicy", "contains-egg", "cheese"],
  }];

export default function Dashboard() {
  return (
    <div>
    {/* <div style={{
            color: '#000',
            marginLeft: '20px',
            marginBottom: '20px',
            // fontFamily: 'Inter',
            fontSize: '40px',
            // fontStyle: 'normal',
            // fontWeight: 600,
            lineHeight: 'normal',
          }}>Your Recommendations</div> */}
    <div className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">Your Recommendations</div>
    <div className="flex items-center justify-center min-h-screen">
      <ScrollArea className="w-[60%] rounded-md border">
      <div className="p-4">
        {foodList.map((fooditem) => (
          <div className="flex border rounded-md mb-4">
          {/* <img src={imageUrl} alt={name} className="w-1/3 object-cover rounded-l-md" /> */}
          <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
            <span className="text-gray-500">Image Placeholder</span>
          </div>
          <div className="p-4 flex flex-col justify-between w-2/3">
            <CardHeader>
              <div className="flex">
              <CardTitle style={{ marginRight: '10px' }}>{fooditem.name}</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" fill="#D9D9D9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <CardDescription>{fooditem.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>description</p>
            </CardContent>
            <hr className="my-2 border-gray-300" />
            <CardFooter>
              {fooditem.tags.map((tag) => (
                <Badge style={{ marginRight: '10px' }} variant="outline">{tag}</Badge>
              ))}
            </CardFooter>

            <Dialog>
              <DialogTrigger>Search Restaurants</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>more info!</DialogTitle>
                  <DialogDescription>
                    more information will come soon
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

          </div>
        </div>    
        ))}
      </div>
    </ScrollArea>
    </div>
    </div>
  );
}
