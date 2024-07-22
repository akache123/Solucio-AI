import * as React from "react"
import Image from "next/image"
import { useState } from 'react';
import axios from 'axios';

import { useUser } from "@clerk/nextjs";

import { Progress } from "@/components/ui/progress"
import { Heart } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Maximize2 } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
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
      const url = `/api/generate-recommendations/${user.id}`;
      console.log(url)
      const response = await axios.post(url);
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

// Check which recommendations were previously liked
const sendRecommendationRequest = async (user, setPremiumRecommendation, setPremiumRecommendationLoading) => {
  console.log('Starting recommendation request...');
  setPremiumRecommendationLoading(true);
  const startTime = Date.now();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const geoTime = Date.now();
      console.log(`Geolocation obtained in ${geoTime - startTime}ms`);

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const timeOfDay = "Lunch";

      try {
        console.log('Sending request to server...');
        const response = await fetch(`/api/generate-single-recommendation/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ latitude, longitude, timeOfDay })
        });

        const result = await response.json();
        const fetchTime = Date.now();
        console.log(`Received response in ${fetchTime - geoTime}ms`);

        setPremiumRecommendation(result);  // Ensure state is updated directly
        setPremiumRecommendationLoading(false);
      } catch (error) {
        console.error('Error sending recommendation request:', error);
        setPremiumRecommendationLoading(false);
      }
    }, (error) => {
      console.error('Error getting location', error);
      setPremiumRecommendationLoading(false);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
    setPremiumRecommendationLoading(false);
  }
};

// Handle extracting IDs and calling the new endpoint
const extractAndCheckLiked = async (user, foodList, setLiked) => {
  if (!user) return;
  const ids = foodList.slice(0, 15).map(item => item._id);
  try {
    const response = await axios.post('/api/check-liked', {
      clerkId: user.id,
      ids
    });

    const likedStatus = response.data.results.map(item => item.exists);
    setLiked(likedStatus);

  } catch (error) {
    console.error('Error checking recommendations:', error);
  }
};

const extractAndCheckThumbsDown = async (user, foodList, setThumbsDown) => {
  if (!user) return;
  const ids = foodList.slice(0, 15).map(item => item._id);
  try {
    const response = await axios.post('/api/check-thumbsDown', {
      clerkId: user.id,
      ids
    });

    const thumbsDownStatus = response.data.results.map(item => item.exists);
    setThumbsDown(thumbsDownStatus);

  } catch (error) {
    console.error('Error checking recommendations:', error);
  }
};

// handling liked food items
const handleLiked = async (user, objectId) => {
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

const handleThumbsDown = async (user, objectId) => {
  try {
    const response = await axios.post('/api/thumbs_down', {
      clerkId: user.id,
      objectId: objectId
    });
    console.log('Response from /api/thumbs_down:', response.data);
  } catch (error) {
    console.error('Error on thumbs down:', error);
  }
};

const handleThumbsUp = async (user, objectId) => {
  try {
    const response = await axios.post('/api/thumbs_up', {
      clerkId: user.id,
      objectId: objectId
    });
    console.log('Response from /api/thumbs_up:', response.data);
  } catch (error) {
    console.error('Error on thumbs up:', error);
  }
};

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [foodList, setFoodList] = useState([]);
  const [foodLoading, isFoodLoading] = useState(false);

  const [premiumRecommendation, setPremiumRecommendation] = useState(null);
  const [premiumRecommendationLoading, setPremiumRecommendationLoading] = useState(false);
  
  const [liked, setLiked] = useState([]);

  const [thumbsDown, setThumbsDown] = useState([]);

  // initially load the data
  React.useEffect(() => {
    if (isLoaded && user) {
      fetchRecommendations(user, setFoodList, isFoodLoading);
      sendRecommendationRequest(user, setPremiumRecommendation, setPremiumRecommendationLoading);
    }
  }, [isLoaded, user]);

  // Extract IDs and call the new endpoint when loading is done
  React.useEffect(() => {
    if (!foodLoading && user) {
      extractAndCheckLiked(user, foodList, setLiked);
      extractAndCheckThumbsDown(user, foodList, setThumbsDown);
    }
  }, [foodLoading, foodList, user]);
  
  // heart clicked function
  const heartClicked = (heartIndex, objectId) => {
    if (isLoaded && user) {
      const newLiked = [...liked];
      newLiked[heartIndex] = !newLiked[heartIndex];
      setLiked(newLiked);
      if(newLiked[heartIndex] === true){
        handleLiked(user, objectId);
      // fix the 500 error for delete like
      } else {
        handleDeleteLiked(user, objectId);
      }
    }
  }; 

  const thumbsDownClicked = (thumbsDownIndex, objectId) => {
    if (isLoaded && user) {
      const newThumbsDown = [...thumbsDown];
      newThumbsDown[thumbsDownIndex] = !newThumbsDown[thumbsDownIndex];
      setThumbsDown(newThumbsDown);
      if(newThumbsDown[thumbsDownIndex] === true){
        handleThumbsDown(user, objectId);
      } else {
        handleThumbsUp(user, objectId);
      }
    }
  }; 

  return (
    <div>
      {foodLoading && premiumRecommendationLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-1/2 text-center">
              <div className="scroll-m-20 pb-5 text-3xl font-semibold tracking-tight first:mt-0 p-4">
                loading your recommendations:
              </div>
              <Progress value={70} />
            </div>
          </div>
      ) : (
        <div className="min-h-screen">
          <div className="scroll-m-15 pb-2 text-4xl font-semibold tracking-tight first:mt-0 mb-10">Your Recommendations</div>
          {premiumRecommendation && (
            <div className="relative mb-4 w-2/3 mx-auto flex-1">
              {/* Badge positioned absolutely */}
              <Badge 
                className="mr-2.5 border border-white bg-black text-white"
                variant="outline"
              >
                <Sparkles className="mr-2" style={{ color: '#FFD700' }}/>
                Premium Recommendation
              </Badge>
              {/* Card content */}
              <div className="flex border rounded-md items-center shadow-lg shadow-yellow-500/50">
                <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>
                <div className="p-4 flex flex-col justify-between w-2/3">
                  <CardHeader>
                    <div className="flex">
                      <CardTitle style={{ marginRight: '10px' }}>{premiumRecommendation.name}</CardTitle>
                      <Dialog>
                        <DialogTrigger><Maximize2 /></DialogTrigger>
                        <DialogContent className="flex flex-row">
                        <div className="w-1/3 h-48 bg-gray-300 rounded-l-md flex items-center pl-4">
                          <span className="text-gray-500">Image Placeholder</span>
                        </div>
                          <div className="flex flex-col p-4 w-2/3">
                            <DialogHeader>
                              <DialogTitle>{premiumRecommendation.name}</DialogTitle>
                              <DialogDescription>
                                {premiumRecommendation.cuisine}
                                <Badge className="bg-gray-300 ml-2">
                                  {premiumRecommendation.calories} cal
                                </Badge>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <p className="text-lg font-bold">{premiumRecommendation.price}</p>
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
                    <CardDescription>{premiumRecommendation.cuisine}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>description</p>
                  </CardContent>
                  <hr className="my-2 border-gray-300" />
                  <CardFooter>
                    {premiumRecommendation.dietLabels.map((tag) => (
                      <Badge key={tag} style={{ marginRight: '10px' }} variant="outline">{tag}</Badge>
                    ))}
                  </CardFooter>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center py-4">
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
                          <ThumbsDown
                            className={thumbsDown[index] ? 'shadow-[0_0_10px_rgba(255,0,0,0.8)]' : ''}
                            style={{
                              cursor: 'pointer',
                              marginRight: '10px',
                            }}
                            onClick={() => thumbsDownClicked(index, fooditem._id)}
                          />
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
      )}
    </div>
  );
}
