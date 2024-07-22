import { MongoClient } from 'mongodb';

async function fetchRecentItems(db, collectionName, limit) {
    console.log(`Fetching recent items from collection: ${collectionName}, limit: ${limit}`);
    const collection = db.collection(collectionName);
    const items = await collection.find({}, { projection: { content_embedding: 1 } })
                    .sort({ timestamp: -1 })
                    .limit(limit)
                    .toArray();
    console.log(`Fetched items from ${collectionName}:`, items);
    return items;
}

function meanVector(vectors) {
    console.log('Calculating mean vector for:', vectors);
    if (vectors.length === 0) return [];
    const sumVector = vectors.reduce((acc, vec) => acc.map((a, i) => a + vec[i]), Array(vectors[0].length).fill(0));
    const meanVec = sumVector.map(x => x / vectors.length);
    console.log('Mean vector:', meanVec);
    return meanVec;
}

function invertVector(vector) {
    console.log('Inverting vector:', vector);
    const invertedVec = vector.map(x => -x);
    console.log('Inverted vector:', invertedVec);
    return invertedVec;
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
        if (queryVector.length === 0) {
            queryVector = dislikedInvertedVector;
        } else {
            queryVector = queryVector.map((value, index) => value + dislikedInvertedVector[index]);
        }
    }
    console.log("queryVector:", queryVector);
    return queryVector;
}

function removeDuplicates(results) {
    console.log('Removing duplicates from results:', results);
    const uniqueResults = [];
    const seenNames = new Set();

    results.forEach(result => {
        if (result.name && !seenNames.has(result.name)) {
            uniqueResults.push(result);
            seenNames.add(result.name);
        }
    });

    console.log('Unique results:', uniqueResults);
    return uniqueResults;
}

export default async function handler(req, res) {
    console.log('Request received:', req.method, req.query);

    if (req.method === 'POST') {
        const clerkID = req.query.clerkID;
        console.log('Clerk ID:', clerkID);
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri);

        try {
            console.log('Connecting to MongoDB...');
            await client.connect();
            console.log('Connected to MongoDB');
            const db = client.db(clerkID);
            const solucioFoodDb = client.db('solucio-food');

            const likedItems = await fetchRecentItems(db, 'liked', 30);
            const thumbsUpItems = await fetchRecentItems(db, 'thumbs_up', 30);
            const swipeRightItems = await fetchRecentItems(db, 'swipe_right', 30);
            const swipeLeftItems = await fetchRecentItems(db, 'swipe_left', 30);
            const thumbsDownItems = await fetchRecentItems(db, 'thumbs_down', 30);

            const positiveItems = [...likedItems, ...swipeRightItems, ...(thumbsUpItems || [])];
            console.log('Positive items:', positiveItems);
            const negativeItems = [...swipeLeftItems, ...(thumbsDownItems || [])];
            console.log('Negative items:', negativeItems);

            const queryVector = await generateQueryVector(positiveItems, negativeItems);

            console.log('Querying solucio-food-embeddings with vector:', queryVector);
            if (queryVector.length === 0) {
                throw new Error("Query vector is empty");
            }

            let uniqueResults = [];
            let attempts = 0;
            const numCandidates = 5000;
            const fetchLimit = 50; 

            while (uniqueResults.length < 15 && attempts < 5) {
                const results = await solucioFoodDb.collection('solucio-food-embeddings').aggregate([
                    {
                        "$vectorSearch": {
                            "index": "vector_index",
                            "path": "content_embedding",
                            "queryVector": queryVector,
                            "numCandidates": numCandidates,
                            "limit": fetchLimit
                        }
                    }
                ]).toArray();
                console.log('Results from vector search:', results);

                const filteredResults = results.slice(1);

                uniqueResults = removeDuplicates([...uniqueResults, ...filteredResults]);
                attempts++;
            }

            uniqueResults = uniqueResults.slice(0, 15);

            res.status(200).json(uniqueResults);
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            res.status(500).json({ error: 'Failed to generate recommendations' });
        } finally {
            console.log('Closing MongoDB connection');
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
