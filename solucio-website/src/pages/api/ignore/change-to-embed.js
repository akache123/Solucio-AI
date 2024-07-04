// pages/api/update-embeddings.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri);

        try {
            await client.connect();
            const db = client.db('solucio-food');
            const collection = db.collection('solucio-food-embeddings');

            // Update all documents by renaming the "embedding" field to "content_embedding"
            const result = await collection.updateMany(
                { "embedding": { $exists: true } },
                { $rename: { "embedding": "content_embedding" } }
            );

            console.log(`Modified ${result.modifiedCount} documents`);

            res.status(200).json({
                message: `Modified ${result.modifiedCount} documents`
            });
        } catch (error) {
            console.error('Error updating embeddings:', error);
            res.status(500).json({ error: 'Failed to update embeddings' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
