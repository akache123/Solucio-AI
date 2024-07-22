import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { clerkId, objectId } = req.body;

        if (!clerkId || !objectId) {
            return res.status(400).json({ error: 'clerkId and objectId are required' });
        }

        let validObjectId;
        try {
            validObjectId = new ObjectId(objectId);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid objectId format' });
        }

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            await client.connect();

            const foodDb = client.db('solucio-food');
            const embeddingsCollection = foodDb.collection('solucio-food-embeddings');
            const objectData = await embeddingsCollection.findOne({ _id: validObjectId });

            if (!objectData) {
                return res.status(404).json({ error: 'Object ID not found in solucio-food-embeddings' });
            }

            const userDb = client.db(clerkId);
            const thumbsDownCollection = userDb.collection('thumbs_up');

            const document = {
                ...objectData,
                timestamp: new Date(),
            };

            await thumbsDownCollection.insertOne(document);

            res.status(200).json({ message: 'Thumbs up successfully recorded with object data' });
        } catch (error) {
            console.error('Database connection error', error);
            res.status(500).json({ error: 'Failed to connect to the database' });
        } finally {
            try {
                await client.close();
            } catch (closeError) {
                console.error('Error closing the database connection', closeError);
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
