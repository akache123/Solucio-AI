import * as React from "react"
import Image from "next/image"
import { useState } from 'react';
import axios from 'axios';
// import { MongoClient } from 'mongodb';
import { Progress } from "@/components/ui/progress"


import { useUser } from "@clerk/nextjs";

import { Heart } from 'lucide-react';
import { Maximize2 } from 'lucide-react';
 
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { useClerk } from '@clerk/clerk-react';

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

const fetchRecommendations = async (user, setFoodList, isFoodLoading) => {
  isFoodLoading(true);
  if (user) {
    try {
      const clerkId = user.id; 
      const url = `/api/generate-recommendations/${clerkId}`;
      const response = await axios.post(url);
      console.log('Recommendations:', response.data);
      setFoodList(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      isFoodLoading(false);
    }
  } else {
    console.error('User not signed in');
  }
};

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [foodList, setFoodList] = useState([]);
  const [foodLoading, isFoodLoading] = useState();
  
  const hearts = Array(foodList.length).fill(null);

  const [liked, setLiked] = useState(Array(hearts.length).fill(false));
  
  const heartClicked = (heartIndex) => {
    console.log(heartIndex)
    if (isLoaded && user) {
      console.log("Clerk user ID:", user.id);
      const newLiked = liked.map((item, i) => (i === heartIndex ? !item : item));
      setLiked(newLiked);
    }
  };

  React.useEffect(() => {
    if (isLoaded && user) {
      console.log("Clerk user ID:", user.id);
      fetchRecommendations(user, setFoodList, isFoodLoading);
    }
  }, [isLoaded, user, setFoodList]);

  return (
    <div>
      {foodLoading ? (
          <div className="flex items-center justify-center min-h-screen">
          <div className="w-1/2 text-center"> {/* Adjust the width as needed */}
            <div className="scroll-m-20 pb-5 text-3xl font-semibold tracking-tight first:mt-0 p-4">
              loading your recommendations:
            </div>
            <Progress value={70} />
          </div>
        </div>
        ) : (
          <div>
      <div className="scroll-m-20 pb-2 text-4xl font-semibold tracking-tight first:mt-0">Your Recommendations</div>
      <div className="flex items-center justify-center min-h-screen">
        <ScrollArea className="w-[60%] rounded-md border">
        <div className="p-4">
          {foodList.map((fooditem, index) => (
            <div key={fooditem._id} className="flex border rounded-md mb-4">
            {/* <img src={imageUrl} alt={name} className="w-1/3 object-cover rounded-l-md" /> */}
            <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <div className="p-4 flex flex-col justify-between w-2/3">
              <CardHeader>
                <div className="flex">
                  <CardTitle style={{ marginRight: '10px' }}>{fooditem.name}</CardTitle>
                  <Heart style={{ 
                    fill: liked[index] ? 'red' : 'none', 
                    cursor: 'pointer', 
                    marginRight: '10px' 
                  }} onClick={()=>heartClicked(index)}/>
                  <Dialog>
                    <DialogTrigger><Maximize2 /></DialogTrigger>
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
                <CardDescription>{fooditem.cuisine}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>description</p>
              </CardContent>
              <hr className="my-2 border-gray-300" />
              <CardFooter>
                {fooditem.dietLabels.map((tag) => (
                  <Badge key={tag} style={{ marginRight: '10px' }} variant="outline">{tag}</Badge>
                ))}
              </CardFooter>
            </div>
          </div>    
          ))}
        </div>
        </ScrollArea>
      </div>
   </div>
        )};
    </div>
  );
}