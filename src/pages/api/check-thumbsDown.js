import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clerkId, ids } = req.body;

    if (!clerkId || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'clerkId and an array of IDs are required' });
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();

      const db = client.db(clerkId);
      const collection =  db.collection('thumbs_down');

      // Convert string IDs to ObjectId
      const objectIds = ids.map(id => new ObjectId(id));
      console.log(objectIds);

      // Check if each ID exists in the collection
      const results = await Promise.all(objectIds.map(async (objectId) => {
        const exists = await collection.findOne({ _id: objectId });
        return { _id: objectId, exists: !!exists };
      }));

      // Return the results
      res.status(200).json({ results });
    } catch (error) {
      console.error('Database connection error', error);
      res.status(500).json({ error: 'Failed to connect to the database' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}