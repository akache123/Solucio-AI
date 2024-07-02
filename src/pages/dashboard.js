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
 
const foodList = [
  {
    name: "pizza",
    cuisine: "Italian",
  },
  {
    name: "burger",
    cuisine: "american",
  },
  {
    name: "noodles",
    cuisine: "chinese",
  },
  {
    name: "pizza",
    cuisine: "Italian",
  },
  {
    name: "burger",
    cuisine: "american",
  },
  {
    name: "noodles",
    cuisine: "chinese",
  }];

export default function Dashboard() {
  return (
    <div>
    <div style={{
            color: '#000',
            marginLeft: '20px',
            marginBottom: '20px',
            fontFamily: 'Inter',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
          }}>Your Recommendations</div>
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
              <CardTitle>{fooditem.name}</CardTitle>
              <CardDescription>{fooditem.cuisine}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </div>
        </div>    
        ))}
      </div>
    </ScrollArea>
    </div>
    </div>
  );
}
