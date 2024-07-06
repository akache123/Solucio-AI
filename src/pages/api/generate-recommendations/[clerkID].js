// pages/api/generate-recommendations/[clerkId].js
import { MongoClient } from 'mongodb';

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

function removeDuplicates(results) {
    const uniqueResults = [];
    const seenNames = new Set();

    results.forEach(result => {
        if (result.name && !seenNames.has(result.name)) {
            uniqueResults.push(result);
            seenNames.add(result.name);
        }
    });

    return uniqueResults;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const clerkId = req.query.clerkID;
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri);
  
      try {
        await client.connect();
        const db = client.db(clerkId);
            const solucioFoodDb = client.db('solucio-food');
            await client.connect();
            const embeddingsCollection = solucioFoodDb.collection('solucio-food-embeddings');
        
            const indexInformation = await embeddingsCollection.indexInformation();
            console.log("Index Information:", indexInformation);
        
            const likedItems = await fetchRecentItems(db, 'liked', 30);
            console.log(likedItems)
            const swipeRightItems = await fetchRecentItems(db, 'swipe_right', 30);
            console.log(swipeRightItems)

            const swipeLeftItems = await fetchRecentItems(db, 'swipe_left', 30);
            console.log(swipeLeftItems)

            const positiveItems = [...likedItems, ...swipeRightItems];
            const negativeItems = swipeLeftItems;

            const queryVector = await generateQueryVector(positiveItems, negativeItems);
            
            const results = await solucioFoodDb.collection('solucio-food-embeddings').aggregate([
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "content_embedding",
                        "queryVector": queryVector,
                        "numCandidates": 5000,
                        "limit": 15
                    }
                }
            ]).toArray();

            const uniqueResults = removeDuplicates(results);

            res.status(200).json(uniqueResults);
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