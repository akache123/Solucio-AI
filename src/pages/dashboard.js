import * as React from "react"
import Image from "next/image"
import { useState } from 'react';
import axios from 'axios';

import { useUser } from "@clerk/nextjs";

import { Progress } from "@/components/ui/progress"
import { Heart } from 'lucide-react';
import { Maximize2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// fetch the initial recommendations
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

// handling liked food items
const handleLiked = async (user, objectId) => {
  console.log('onject ID', objectId);
  try {
    const response = await axios.post('/api/liked', {
      clerkId: user.id,
      objectId: objectId
    });
    console.log('Response from /api/liked:', response.data);
  } catch (error) {
    console.error('Error on liked:', error);
  }
};

// handling deleting liked food items
const handleDeleteLiked = async (user, objectId) => {
  console.log('onject ID', objectId);
  try {
    const response = await axios.post('/api/delete_liked', {
      clerkId: user.id,
      objectId: objectId
    });
    console.log('Response from /api/delete_liked:', response.data);
  } catch (error) {
    console.error('Error on delete_liked:', error);
  }
};

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [foodList, setFoodList] = useState([]);
  const [foodLoading, isFoodLoading] = useState();
  
  const hearts = Array(foodList.length).fill(null);

  const [liked, setLiked] = useState(Array(hearts.length).fill(false));

  // initially load the data
  React.useEffect(() => {
    if (isLoaded && user) {
      console.log("Clerk user ID:", user.id);
      fetchRecommendations(user, setFoodList, isFoodLoading);
    }
  }, [isLoaded, user, setFoodList]);
  
  // heart clicked function
  const heartClicked = (heartIndex, objectId) => {
    console.log(heartIndex);
    if (isLoaded && user) {
      console.log("Clerk user ID:", user.id);
      const newLiked = [...liked];
      newLiked[heartIndex] = !newLiked[heartIndex];
      console.log(newLiked[heartIndex]);
      setLiked(newLiked);
      if(newLiked[heartIndex] === true){
        handleLiked(user, objectId);
      } else {
        handleDeleteLiked(user, objectId);
      }
    }
  }; 

  return (
    <div>
      {foodLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-1/2 text-center">
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
                          }} onClick={()=>heartClicked(index, fooditem._id)}/>
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