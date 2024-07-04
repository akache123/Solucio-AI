import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db('solucio-food');
      const collection = db.collection('solucio-food-embeddings');

      const potentialDocs = await collection.aggregate([
        { $sample: { size: 50 } } 
      ]).toArray();

      const uniqueNames = new Set();
      const uniqueDocs = [];

      for (const doc of potentialDocs) {
        if (!uniqueNames.has(doc.name) && uniqueDocs.length < 10) {
          uniqueNames.add(doc.name);
          uniqueDocs.push(doc);
        }
      }

      res.status(200).json(uniqueDocs);
    } catch (error) {
      console.error('Failed to retrieve documents', error);
      res.status(500).json({ error: 'Failed to retrieve random documents from the database' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
