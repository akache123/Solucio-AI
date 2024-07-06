import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        if (req.method === 'POST') {
            const { clerkId, objectId } = req.body;

            if (!clerkId || !objectId) {
                return res.status(400).json({ error: 'clerkId and objectId are required' });
            }

            const validObjectId = new ObjectId(objectId);
            const foodDb = client.db('solucio-food');
            const embeddingsCollection = foodDb.collection('solucio-food-embeddings');
            const objectData = await embeddingsCollection.findOne({ _id: validObjectId });

            if (!objectData) {
                return res.status(404).json({ error: 'Object ID not found in solucio-food-embeddings' });
            }

            const userDb = client.db(clerkId);
            const swipeRightCollection = userDb.collection('liked');

            const document = {
                ...objectData, 
                timestamp: new Date(), 
            };

            await swipeRightCollection.insertOne(document);

            res.status(200).json({ message: 'Liked officially deleted with object data' });
        } else if (req.method === 'DELETE') {
            const { clerkId, objectId } = req.body;

            if (!clerkId || !objectId) {
                return res.status(400).json({ error: 'clerkId and objectId are required' });
            }

            const validObjectId = new ObjectId(objectId);
            const userDb = client.db(clerkId);
            const swipeRightCollection = userDb.collection('liked');

            const deleteResult = await swipeRightCollection.deleteOne({ _id: validObjectId });

            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ error: 'Object ID not found in user liked collection' });
            }

            res.status(200).json({ message: 'Swipe unliked successfully removed' });
        } else {
            res.setHeader('Allow', ['POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Database connection error', error);
        res.status(500).json({ error: 'Failed to connect to the database' });
    } finally {
        await client.close();
    }
}
