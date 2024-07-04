import { MongoClient } from 'mongodb';
import { OpenAI } from 'openai';

async function fetchRecentItems(db, collectionName, limit) {
    const collection = db.collection(collectionName);
    return collection.find({}, { projection: { content_embedding: 1 } })  
                    .sort({ timestamp: -1 })
                    .limit(limit)
                    .toArray();
}

function meanVector(vectors) {
    const sumVector = vectors.reduce((acc, vec) => acc.map((a, i) => a + vec[i]), Array(vectors[0].length).fill(0));
    return sumVector.map(x => x / vectors.length);
}

function invertVector(vector) {
    return vector.map(x => -x);
}

async function generateQueryVector(likedItems, dislikedItems) {
    console.log("Liked Items:", likedItems);
    console.log("Disliked Items:", dislikedItems);

    const likedVectors = likedItems.map(item => item.content_embedding);
    const dislikedVectors = dislikedItems.map(item => item.content_embedding);

    console.log("Liked Vectors:", likedVectors);
    console.log("Disliked Vectors:", dislikedVectors);

    let queryVector = [];
    if (likedVectors.length > 0) {
        const likedMeanVector = meanVector(likedVectors);
        queryVector = likedMeanVector;
    }
    if (dislikedVectors.length > 0) {
        const dislikedMeanVector = meanVector(dislikedVectors);
        const dislikedInvertedVector = invertVector(dislikedMeanVector);
        queryVector = queryVector.map((value, index) => value + dislikedInvertedVector[index]);
    }
    console.log("queryVector:", queryVector)
    return queryVector;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const clerkId = req.query.clerkID;
        const { latitude, longitude } = req.body; // Extract coordinates from request body
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri);
  
        try {
            await client.connect();
            const db = client.db(clerkId);
            const solucioFoodDb = client.db('solucio-food');
            await client.connect();
            const embeddingsCollection = solucioFoodDb.collection('solucio-food-embeddings');
        
        
            const likedItems = await fetchRecentItems(db, 'liked', 30);
            console.log(likedItems);
            const swipeRightItems = await fetchRecentItems(db, 'swipe_right', 30);
            console.log(swipeRightItems);

            const swipeLeftItems = await fetchRecentItems(db, 'swipe_left', 30);
            console.log(swipeLeftItems);

            const positiveItems = [...likedItems, ...swipeRightItems];
            const negativeItems = swipeLeftItems;

            const queryVector = await generateQueryVector(positiveItems, negativeItems);

            console.log(latitude, longitude)

            const result = await solucioFoodDb.collection('solucio-food-embeddings').aggregate([
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "content_embedding",
                        "queryVector": queryVector,
                        "numCandidates": 5000,
                        "limit": 1
                    }
                }
            ]).toArray();

            const openAI = new OpenAI({
                apiKey: process.env.OPEN_AI_KEY
              });
              const prompt = `Using the following coordinates and the general food that the user likes, give me 5 restaraunts and the best item that they have that matches this description. Make sure to include exactly what is in it, use no generalities, always start the JSON with the exact name of the food item, focus on the food items, and include the information of the restaurant. Provide the data in raw JSON format only. Each item should have the following attributes without ever, ever, ever using '''json THIS IS SO IMPORTANT!! Also make sure to never give anything except pure json format:

              1. "name": The exact name of the food item (e.g., "Chicken Parmesan", "Veggie Pizza").
              2. "restaurantName": The name of the restaurant.
              3. "address": The address of the restaurant.
              4. "website": The restaurant's website.
              5. "phoneNumber": The restaurant's phone number.
              6. "deliveryTime": The estimated delivery time (Options: "10-20 minutes", "20-30 minutes", "30-40 minutes", "40+ minutes").
              7. "cuisine": The type of cuisine (Options: "Italian", "Japanese", "Mexican", "Indian", "American", "Chinese", "Thai", "Mediterranean", "French", "Vietnamese").
              8. "taste": The primary taste profile (Options: "savory", "sweet", "umami", "bitter", "sour").
              9. "spiceLevel": The spice intensity (Options: "none", "mild", "medium", "hot", "extra hot").
              10. "price": Exact pricing, no estimates in ($XX.XX) format.
              11. "ingredients": List main ingredients (e.g., "tomatoes, mozzarella cheese, basil", "chicken, curry sauce, rice").
              12. "vegetarian": Boolean indicating if the item is vegetarian (Options: true, false).
              13. "vegan": Boolean indicating if the item is vegan (Options: true, false).
              14. "calories": Exact calorie count, if you can, if not estimate it (e.g., "250", "500", "750").
              15. "servingSize": Indicate serving size (Options: "single", "small", "medium", "large", "family size").
              16. "available": Boolean indicating if the item is currently available (Options: true, false).
              17. "mealType": Type of meal (Options: "appetizer", "main course", "dessert", "side dish", "beverage").
              18. "dietLabels": Array of dietary labels (Options: ["keto", "paleo", "low carb", "high protein", "low fat"]).
              19. "preparationTime": Estimated preparation time in minutes (Options: "<15", "15-30", "30-45", "45-60", ">60").
              20. "popularity": Rating based on customer feedback (Options: "low", "moderate", "high", "top seller").
              21. "allergens": List of common allergens present (Options: ["nuts", "dairy", "gluten", "eggs", "shellfish"]).
              22. "seasonal": Boolean indicating if the dish is a seasonal special (Options: true, false).
              23. "timeOfDay": List of times to choose from (Options: ["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", "Evening Snack", "Midnight Snack"]).
              
              Given the following JSON data and coordinates, find the top 5 places that are open right now, deliver the fastest, and return them in the specified format. Structure each menu item in this JSON format with the specified attributes, ensuring that all fields are filled out where applicable.`

              const response = await openAI.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt },
                    { role: "user", content: JSON.stringify({ coordinates: { latitude, longitude }, data: result }) },
                ],
            });

            const generatedContent = response.choices[0].message.content;

            console.log(generatedContent)

            res.status(200).json(generatedContent);
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            res.status(500).json({ error: 'Failed to generate recommendations' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
