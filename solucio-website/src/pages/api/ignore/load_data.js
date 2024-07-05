// src/api/load_data.js
import axios from 'axios';
import { Configuration, OpenAI } from 'openai';
import { MongoClient } from 'mongodb';

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
});
const uri = process.env.MONGO_URI; 
const mongo_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'solucio-food'; // database name
const collectionName = 'solucio-food-embeddings'; // collection name


async function storeEmbeddings(data) {
  try {
    await mongo_client.connect();
    const database = mongo_client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(data);
    console.log(`New listing created with the following id: ${result.insertedId}`);
  } catch (error) {
    console.error('Failed to insert data:', error);
  } finally {
    await mongo_client.close();
  }
}

async function getEmbedding(text) {
  try {
    const response = await openAI.embeddings.create({
      model: "text-embedding-3-small",
      input: [text]
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error fetching embedding:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const searchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    let results = [];
    let pageToken = null;

    try {
      do {
        const params = {
          location: `${latitude},${longitude}`,
          radius: '2500',
          type: 'restaurant',
          key: apiKey,
          pagetoken: pageToken
        };

        const response = await axios.get(searchUrl, { params });
        results = results.concat(response.data.results);
        pageToken = response.data.next_page_token;

        if (pageToken) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } while (pageToken && results.length < 50);

      // Fetch detailed information
      results = await Promise.all(results.map(async (restaurant) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,rating,formatted_address,website&key=${apiKey}`;
        const detailResponse = await axios.get(detailsUrl);
        const { name, rating, formatted_address, website } = detailResponse.data.result;
        return { name, rating, address: formatted_address, website };
      }));

      await splitAndSendToOpenAI(results, res); // Split and send results to OpenAI

    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      res.status(500).json({ error: 'Failed to fetch restaurant data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}




const splitAndSendToOpenAI = async (results, res) => {
  const chunkSize = 20;
  const promptTemplate = `give me 20 of each of their menu items, exactly what is in it, use tons of generalities, always start the JSON with a basic name of the food item, only focus on the food items, don't include any description of the restaurant,
  give it in a raw json format, and only the json, nothing else. Each item should have the following attributes without ever using '''json, make sure to never give anything except pure json format:
  1. "name": The basic name of the food item (e.g., "Chicken Parmesan", "Veggie Pizza").
  2. "cuisine": The type of cuisine (Options: "Italian", "Japanese", "Mexican", "Indian", "American", "Chinese", "Thai", "Mediterranean", "French", "Vietnamese").
  3. "taste": The primary taste profile (Options: "savory", "sweet", "umami", "bitter", "sour").
  4. "spiceLevel": The spice intensity (Options: "none", "mild", "medium", "hot", "extra hot").
  5. "price": Estimate pricing always included (Format: "$10-$15", "$16-$25", "$26-$35", "$36-$50", "Above $50").
  6. "ingredients": List main ingredients (e.g., "tomatoes, mozzarella cheese, basil", "chicken, curry sauce, rice").
  7. "vegetarian": Boolean indicating if the item is vegetarian (Options: true, false).
  8. "vegan": Boolean indicating if the item is vegan (Options: true, false).
  9. "calories": Approximate calorie count (e.g., "250", "500", "750").
  10. "servingSize": Indicate serving size (Options: "single", "small", "medium", "large", "family size").
  11. "available": Boolean indicating if the item is currently available (Options: true, false).
  12. "mealType": Type of meal (Options: "appetizer", "main course", "dessert", "side dish", "beverage").
  13. "dietLabels": Array of dietary labels (Options: ["keto", "paleo", "low carb", "high protein", "low fat"]).
  14. "preparationTime": Estimated preparation time in minutes (Options: "<15", "15-30", "30-45", "45-60", ">60").
  15. "popularity": Rating based on customer feedback (Options: "low", "moderate", "high", "top seller").
  16. "allergens": List of common allergens present (Options: ["nuts", "dairy", "gluten", "eggs", "shellfish"]).
  17. "seasonal": Boolean indicating if the dish is a seasonal special (Options: true, false).
  18. "timeOfDay": List of times to choose from (Options: ["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", "Evening Snack", "Midnight Snack"]).
  
  Structure each menu item in this JSON format with the specified attributes, ensuring that all fields are filled out where applicable. This will be used to generate comprehensive and uniform data for each dish without adding restaurant-specific details. Make sure to never add the name of the place.`;
  
  for (let i = 0; i < results.length; i += chunkSize) {
    const chunk = results.slice(i, i + chunkSize);
    const prompt = `${promptTemplate}\n${JSON.stringify(chunk)}`;

    try {
      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: c }
        ],
      });


      const generatedContent = response.choices[0].message.content;
      const items = JSON.parse(generatedContent);
      
      for (const item of items) {
        const full_embedding = await getEmbedding(JSON.stringify(item));
        console.log('Embedding:', full_embedding);
        
        const itemWithEmbedding = {
          ...item,
          embedding: full_embedding
        };
        await storeEmbeddings(itemWithEmbedding);
      }

    } catch (error) {
      console.error('Error fetching OpenAI completion:', error);
    }
  }
  res.json({ results }); 
};